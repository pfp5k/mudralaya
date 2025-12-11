const crypto = require('crypto');
const { config } = require('../config/env');

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const COOKIE_NAME = 'admin_session';

const sessions = new Map();

const createSession = (user) => {
  const id = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(id, { user, expiresAt });
  return { id, expiresAt };
};

const destroySession = (id) => {
  sessions.delete(id);
};

const getSession = (id) => {
  const entry = sessions.get(id);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    sessions.delete(id);
    return null;
  }
  // Sliding expiration
  entry.expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(id, entry);
  return entry;
};

const adminSession = (req, res, next) => {
  const { dashboardAdminUser, dashboardAdminPass } = config;
  if (!dashboardAdminUser || !dashboardAdminPass) {
    return res.status(503).json({ error: 'Dashboard admin credentials are not configured' });
  }

  const sid = req.cookies?.[COOKIE_NAME];
  if (!sid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const session = getSession(sid);
  if (!session) {
    res.clearCookie(COOKIE_NAME);
    return res.status(401).json({ error: 'Session expired' });
  }

  req.adminUser = session.user;
  req.sessionId = sid;
  req.sessionExpiresAt = session.expiresAt;
  return next();
};

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: SESSION_TTL_MS
});

module.exports = {
  SESSION_TTL_MS,
  COOKIE_NAME,
  adminSession,
  createSession,
  destroySession,
  getSession,
  cookieOptions
};
