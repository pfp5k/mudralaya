const { Router } = require('express');
const { z } = require('zod');
const { persistDocument } = require('../utils/persistence');

const router = Router();

const newsletterSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
});

router.post('/', async (req, res, next) => {
  try {
    const result = newsletterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors
      });
    }

    const payload = {
      ...result.data,
      form: 'newsletter'
    };

    const persisted = await persistDocument('newsletter_subscriptions', payload);

    // eslint-disable-next-line no-console
    console.log('Newsletter subscription received', { email: payload.email, persisted: persisted.persisted });

    return res.status(201).json({
      message: 'Subscription saved.',
      data: payload,
      persisted: persisted.persisted,
      id: persisted.id
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
