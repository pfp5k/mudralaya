const { Router } = require('express');
const { z } = require('zod');
const { persistDocument } = require('../utils/persistence');
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const router = Router();

// Schema for payment update
const paymentUpdateSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  payment_status: z.string().default('Paid')
});

router.post('/payment-status', async (req, res, next) => {
  try {
    const result = paymentUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors
      });
    }

    const { id, razorpay_payment_id, payment_status } = result.data;

    // Update the document
    const updateResult = await getDb().collection('join_requests').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          razorpay_payment_id,
          payment_status,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Join request not found' });
    }

    return res.json({
      message: 'Payment status updated successfully',
      success: true
    });
  } catch (err) {
    return next(err);
  }
});

const joinSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  mobileNumber: z
    .string({ required_error: 'Mobile number is required' })
    .trim()
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  emailId: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  dateOfBirth: z
    .string({ required_error: 'Date of birth is required' })
    .refine((value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime()) && date <= new Date();
    }, 'Date of birth must be a valid past date'),
  profession: z.enum(['student', 'working-professional', 'house-wife', 'business-man', 'other'], {
    errorMap: () => ({ message: 'Profession is required' })
  })
});

router.post('/', async (req, res, next) => {
  try {
    const result = joinSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors
      });
    }

    const payload = {
      ...result.data,
      form: 'join-us',
      payment_status: 'Pending',
      razorpay_payment_id: null
    };

    const persisted = await persistDocument('join_requests', payload);

    // eslint-disable-next-line no-console
    console.log('Join request received', { ...payload, persisted: persisted.persisted });

    return res.status(201).json({
      message: 'Join request received. We will contact you soon.',
      data: payload,
      persisted: persisted.persisted,
      id: persisted.id
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
