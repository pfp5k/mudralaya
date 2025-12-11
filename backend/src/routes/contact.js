const { Router } = require('express');
const { z } = require('zod');
const { persistDocument } = require('../utils/persistence');

const router = Router();

const contactSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .transform((value) => value.replace(/[^\d+]/g, ''))
    .refine((value) => /^\+91[6-9]\d{9}$/.test(value), {
      message: 'Please enter a valid Indian phone number (+91 followed by 10 digits)'
    }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  occupation: z.enum(['student', 'professional', 'homemaker', 'entrepreneur', 'retired', 'other'], {
    errorMap: () => ({ message: 'Occupation is required' })
  }),
  qualification: z.enum(['10th', '12th', 'graduate', 'postgraduate', 'other'], {
    errorMap: () => ({ message: 'Qualification is required' })
  }),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(2, 'Subject is required')
    .max(100, 'Subject must be under 100 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
});

router.post('/', async (req, res, next) => {
  try {
    const result = contactSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors
      });
    }

    const payload = {
      ...result.data,
      receivedAt: new Date().toISOString()
    };

    const persisted = await persistDocument('contact_requests', payload);

    // eslint-disable-next-line no-console
    console.log('Contact request received', { ...payload, persisted: persisted.persisted });

    return res.status(202).json({
      message: 'Contact request received. We will reach out soon.',
      data: payload,
      persisted: persisted.persisted,
      id: persisted.id
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
