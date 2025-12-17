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

const normalizePhone = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length >= 10) return digits.slice(-10);
    return digits;
};

const normalizeEmail = (value) => {
    const email = String(value || '').trim().toLowerCase();
    return email || null;
};

const parseDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d;
};

const getMembershipAmountSubunits = () => {
    const amountInr = Number(process.env.MEMBERSHIP_AMOUNT_INR || 99);
    if (!Number.isFinite(amountInr) || amountInr <= 0) return 9900;
    return Math.round(amountInr * 100);
};

const fetchRecentPayments = async (from, to, maxCount = 500) => {
    const pageSize = 100;
    const items = [];

    for (let skip = 0; skip < maxCount; skip += pageSize) {
        // eslint-disable-next-line no-await-in-loop
        const batch = await razorpay.payments.all({ from, to, count: pageSize, skip });
        const page = Array.isArray(batch?.items) ? batch.items : [];
        items.push(...page);
        if (page.length < pageSize) break;
    }

    return items.slice(0, maxCount);
};

const indexPaymentsByPhone = (payments) => {
    const map = new Map();
    for (const payment of payments) {
        const phone = normalizePhone(payment?.contact);
        if (!phone) continue;
        const list = map.get(phone) || [];
        list.push(payment);
        map.set(phone, list);
    }
    return map;
};

const indexPaymentsByOrderId = (payments) => {
    const map = new Map();
    for (const payment of payments) {
        const orderId = typeof payment?.order_id === 'string' ? payment.order_id.trim() : '';
        if (!orderId) continue;
        const list = map.get(orderId) || [];
        list.push(payment);
        map.set(orderId, list);
    }
    return map;
};

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

        const expectedAmount = getMembershipAmountSubunits();
        const createdAtDates = candidates
            .map((row) => parseDate(row?.createdAt))
            .filter(Boolean);
        const earliest = createdAtDates.length
            ? new Date(Math.min(...createdAtDates.map((d) => d.getTime())))
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const from = new Date(earliest.getTime() - 24 * 60 * 60 * 1000);
        const to = new Date();

        const fromSec = Math.floor(from.getTime() / 1000);
        const toSec = Math.floor(to.getTime() / 1000);

        let recentPayments = [];
        try {
            recentPayments = await fetchRecentPayments(fromSec, toSec, 500);
        } catch (err) {
            const statusCode = err?.statusCode || err?.status || 500;
            const code = err?.error?.code || err?.code;
            const message = err?.error?.description || err?.error?.message || err?.message || 'Razorpay request failed';
            // eslint-disable-next-line no-console
            console.error('Razorpay payments.all failed', { statusCode, code, message });
            return res.status(502).json({
                error: `Razorpay API error (${statusCode})`,
                code,
                message
            });
        }
        const eligiblePayments = recentPayments.filter((p) => p?.status === 'captured' && p?.amount === expectedAmount);
        const paymentsByPhone = indexPaymentsByPhone(eligiblePayments);
        const paymentsByOrderId = indexPaymentsByOrderId(eligiblePayments);
        const paymentsById = new Map(eligiblePayments.filter((p) => p?.id).map((p) => [p.id, p]));
        const usedPaymentIds = new Set();

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
                let checkedOrderId = null;

                if (paymentId) {
                    const cached = paymentsById.get(paymentId);
                    if (cached) {
                        capturedPayment = cached;
                    } else {
                        const payment = await razorpay.payments.fetch(paymentId);
                        if (payment?.status === 'captured') {
                            capturedPayment = payment;
                        }
                    }
                }

                if (!capturedPayment && resolvedOrderId) {
                    checkedOrderId = resolvedOrderId;
                    const cached = paymentsByOrderId.get(resolvedOrderId) || [];
                    capturedPayment = cached[0] || null;

                    if (!capturedPayment) {
                        const payments = await razorpay.orders.fetchPayments(resolvedOrderId);
                        const items = Array.isArray(payments?.items) ? payments.items : [];
                        capturedPayment = items.find((p) => p?.status === 'captured') || null;
                    }
                }

                if (!capturedPayment) {
                    const joinPhone = normalizePhone(row?.mobileNumber);
                    const joinEmail = normalizeEmail(row?.emailId);
                    const joinCreatedAt = parseDate(row?.createdAt);
                    const candidatesByPhone = joinPhone ? (paymentsByPhone.get(joinPhone) || []) : [];

                    const windowMs = joinEmail ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
                    const matches = candidatesByPhone
                        .filter((p) => p?.id && !usedPaymentIds.has(p.id))
                        .filter((p) => {
                            if (!joinEmail) return true;
                            return normalizeEmail(p?.email) === joinEmail;
                        })
                        .map((p) => {
                            const createdAtMs = typeof p?.created_at === 'number' ? p.created_at * 1000 : null;
                            const diffMs = createdAtMs && joinCreatedAt ? Math.abs(createdAtMs - joinCreatedAt.getTime()) : null;
                            return { payment: p, diffMs };
                        })
                        .filter((entry) => entry.diffMs !== null && entry.diffMs <= windowMs)
                        .sort((a, b) => a.diffMs - b.diffMs);

                    if (matches.length === 1) {
                        capturedPayment = matches[0].payment;
                        resolvedOrderId = resolvedOrderId || capturedPayment?.order_id || '';
                    } else if (matches.length > 1) {
                        errors.push({
                            id: String(row._id),
                            message: 'Multiple matching captured payments found for this contact/email; cannot auto-reconcile.'
                        });
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

                if (!capturedPayment && resolvedOrderId && checkedOrderId !== resolvedOrderId) {
                    checkedOrderId = resolvedOrderId;
                    const cached = paymentsByOrderId.get(resolvedOrderId) || [];
                    capturedPayment = cached[0] || null;

                    if (!capturedPayment) {
                        const payments = await razorpay.orders.fetchPayments(resolvedOrderId);
                        const items = Array.isArray(payments?.items) ? payments.items : [];
                        capturedPayment = items.find((p) => p?.status === 'captured') || null;
                    }
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
                    if (nextPaymentId) usedPaymentIds.add(nextPaymentId);
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
