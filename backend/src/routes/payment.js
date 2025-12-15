const { Router } = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { z } = require('zod');
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const router = Router();

// Initialize Razorpay
// NOTE: Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Rr4pA3QSvG4gpv', // Fallback for dev/test if env not set
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Schema for Order Creation
const orderSchema = z.object({
    amount: z.number().min(1, 'Amount must be at least 1'),
    currency: z.string().default('INR'),
    receipt: z.string().optional()
});

// POST /api/payment/order
router.post('/order', async (req, res, next) => {
    try {
        const result = orderSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors });
        }

        const { amount, currency, receipt } = result.data;

        const options = {
            amount: amount * 100, // Razorpay expects amount in subunits (paise)
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        return res.json(order);
    } catch (err) {
        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error("RAZORPAY_KEY_SECRET is missing!");
            return res.status(500).json({ error: 'Server configuration error: Missing Key Secret' });
        }
        return next(err);
    }
});

// Schema for Verification
const verifySchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
    submissionId: z.string().optional() // Optional for now, to support update logic
});

// POST /api/payment/verify
router.post('/verify', async (req, res, next) => {
    try {
        const result = verifySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, submissionId } = result.data;

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(500).json({ error: 'Server configuration error: Missing Key Secret' });
        }

        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // payment is successful

            // If we have a submissionId, update the document status
            if (submissionId) {
                await getDb().collection('join_requests').updateOne(
                    { _id: new ObjectId(submissionId) },
                    {
                        $set: {
                            razorpay_payment_id,
                            razorpay_order_id,
                            payment_status: 'Paid',
                            updatedAt: new Date()
                        }
                    }
                );
            }

            return res.json({ status: 'ok', message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
