const { config } = require('../config/env');

const apiKeyMiddleware = (req, res, next) => {
  if (!config.dashboardApiKey) {
    return res.status(503).json({ error: 'Dashboard API key not configured.' });
  }

  const provided = req.headers['x-api-key'];
  if (!provided || provided !== config.dashboardApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
};

module.exports = { apiKeyMiddleware };
