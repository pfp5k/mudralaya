const { Router } = require('express');
const { getDb, isDbConnected } = require('../config/db');

const router = Router();

const buildCursor = (collectionName, limit = 50) => {
  return getDb()
    .collection(collectionName)
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
};

router.get('/', async (_req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        error: 'Database is not configured. Set MONGO_URI and MONGO_DB_NAME to enable dashboard data.'
      });
    }

    const [
      contacts,
      joinRequests,
      advisorApplications,
      newsletterSubscriptions
    ] = await Promise.all([
      buildCursor('contact_requests', 100),
      buildCursor('join_requests', 100),
      buildCursor('advisor_applications', 100),
      buildCursor('newsletter_subscriptions', 100)
    ]);

    return res.json({
      counts: {
        contacts: contacts.length,
        joinRequests: joinRequests.length,
        advisorApplications: advisorApplications.length,
        newsletterSubscriptions: newsletterSubscriptions.length
      },
      contacts,
      joinRequests,
      advisorApplications,
      newsletterSubscriptions
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
