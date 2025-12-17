const { Router } = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { z } = require('zod');
const { getDb, isDbConnected } = require('../config/db');
const { ObjectId } = require('mongodb');
const { adminSession } = require('../middleware/session');

const router = Router();

// Initialize Razorpay
// NOTE: Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Schema for Order Creation
const orderSchema = z.object({
    amount: z.coerce.number().min(1, 'Amount must be at least 1'),
    currency: z.string().default('INR'),
    receipt: z.string().optional(),
    submissionId: z.string().optional()
});

// POST /api/payment/order
router.post('/order', async (req, res, next) => {
    try {
        const result = orderSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors });
        }

        const { amount, currency, receipt, submissionId } = result.data;

        const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
        const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
        if (!keyId || !secret) {
            return res.status(500).json({ error: 'Server configuration error: Missing Razorpay keys' });
        }

        const options = {
            amount: amount * 100, // Razorpay expects amount in subunits (paise)
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            ...(submissionId ? { notes: { submissionId } } : {})
        };

        const order = await razorpay.orders.create(options);

        if (submissionId && ObjectId.isValid(submissionId)) {
            await getDb().collection('join_requests').updateOne(
                { _id: new ObjectId(submissionId) },
                {
                    $set: {
                        razorpay_order_id: order.id,
                        updatedAt: new Date()
                    }
                }
            );
        }

        return res.json({ ...order, keyId });
    } catch (err) {
        return next(err);
    }
});

// Schema for Verification
const verifySchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
    submissionId: z.string()
});

// POST /api/payment/verify
router.post('/verify', async (req, res, next) => {
    try {
        const result = verifySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, submissionId } = result.data;

        if (!ObjectId.isValid(submissionId)) {
            return res.status(400).json({ status: 'failure', message: 'Invalid submissionId' });
        }

        const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
        if (!secret) {
            return res.status(500).json({ error: 'Server configuration error: Missing Razorpay keys' });
        }

        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // payment is successful

            const updateResult = await getDb().collection('join_requests').updateOne(
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

            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ status: 'failure', message: 'Join request not found for submissionId' });
            }

            return res.json({ status: 'ok', message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (err) {
        return next(err);
    }
});

const syncSchema = z.object({
    limit: z.coerce.number().min(1).max(200).default(50)
});

// POST /api/payment/sync (admin-only)
// Reconciles pending join_requests with Razorpay order/payment status.
router.post('/sync', adminSession, async (req, res, next) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({
                error: 'Database is not configured. Set MONGO_URI and MONGO_DB_NAME to enable payment sync.'
            });
        }

        const result = syncSchema.safeParse(req.body || {});
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors });
        }

        const { limit } = result.data;

        const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
        const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
        if (!keyId || !secret) {
            return res.status(500).json({ error: 'Server configuration error: Missing Razorpay keys' });
        }

        const candidates = await getDb()
            .collection('join_requests')
            .find({ payment_status: { $ne: 'Paid' } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();

        let scanned = 0;
        let updated = 0;
        const errors = [];

        for (const row of candidates) {
            scanned += 1;

            const orderId = typeof row.razorpay_order_id === 'string' ? row.razorpay_order_id.trim() : '';
            const paymentId = typeof row.razorpay_payment_id === 'string' ? row.razorpay_payment_id.trim() : '';

            try {
                let capturedPayment = null;
                let resolvedOrderId = orderId;

                if (paymentId) {
                    const payment = await razorpay.payments.fetch(paymentId);
                    if (payment?.status === 'captured') {
                        capturedPayment = payment;
                    }
                }

                if (!capturedPayment && !resolvedOrderId && row?._id) {
                    const receipt = `join_${String(row._id)}`;
                    const orders = await razorpay.orders.all({ receipt, count: 1 });
                    const firstOrder = Array.isArray(orders?.items) ? orders.items[0] : null;
                    if (firstOrder?.id) {
                        resolvedOrderId = firstOrder.id;
                        await getDb().collection('join_requests').updateOne(
                            { _id: row._id },
                            { $set: { razorpay_order_id: resolvedOrderId, updatedAt: new Date() } }
                        );
                    }
                }

                if (!capturedPayment && resolvedOrderId) {
                    const payments = await razorpay.orders.fetchPayments(resolvedOrderId);
                    const items = Array.isArray(payments?.items) ? payments.items : [];
                    capturedPayment = items.find((p) => p?.status === 'captured') || null;
                }

                if (!capturedPayment) {
                    continue;
                }

                const nextPaymentId = capturedPayment.id || paymentId || null;
                const nextOrderId = capturedPayment.order_id || resolvedOrderId || null;

                const updateResult = await getDb().collection('join_requests').updateOne(
                    { _id: row._id },
                    {
                        $set: {
                            payment_status: 'Paid',
                            razorpay_payment_id: nextPaymentId,
                            ...(nextOrderId ? { razorpay_order_id: nextOrderId } : {}),
                            updatedAt: new Date()
                        }
                    }
                );

                if (updateResult.modifiedCount > 0) {
                    updated += 1;
                }
            } catch (err) {
                errors.push({
                    id: String(row._id),
                    razorpay_order_id: orderId || undefined,
                    razorpay_payment_id: paymentId || undefined,
                    message: err?.message || 'Razorpay sync failed'
                });
            }
        }

        return res.json({
            status: 'ok',
            scanned,
            updated,
            errors
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
