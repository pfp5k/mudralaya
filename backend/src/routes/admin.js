const { Router } = require('express');
const { config } = require('../config/env');
const {
  createSession,
  destroySession,
  COOKIE_NAME,
  cookieOptions,
  adminSession,
  getSession,
  SESSION_TTL_MS
} = require('../middleware/session');

const router = Router();

router.post('/login', (req, res) => {
  const { dashboardAdminUser, dashboardAdminPass } = config;
  const { username, password } = req.body || {};

  if (!dashboardAdminUser || !dashboardAdminPass) {
    return res.status(503).json({ error: 'Dashboard admin credentials are not configured' });
  }

  if (username !== dashboardAdminUser || password !== dashboardAdminPass) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const session = createSession(username);
  res.cookie(COOKIE_NAME, session.id, cookieOptions());

  return res.json({
    message: 'Logged in',
    expiresAt: session.expiresAt,
    ttlMs: SESSION_TTL_MS
  });
});

router.post('/logout', (req, res) => {
  const sid = req.cookies?.[COOKIE_NAME];
  if (sid) {
    destroySession(sid);
  }
  res.clearCookie(COOKIE_NAME);
  return res.json({ message: 'Logged out' });
});

router.get('/session', adminSession, (req, res) => {
  const session = getSession(req.sessionId);
  return res.json({
    user: req.adminUser,
    expiresAt: session?.expiresAt,
    ttlMs: SESSION_TTL_MS
  });
});

module.exports = router;
