const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { config } = require('./config/env');
const healthRouter = require('./routes/health');
const contactRouter = require('./routes/contact');
const joinRouter = require('./routes/join');
const advisorRouter = require('./routes/advisor');
const newsletterRouter = require('./routes/newsletter');
const dashboardRouter = require('./routes/dashboard');
const adminRouter = require('./routes/admin');
const { adminSession } = require('./middleware/session');

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || config.corsOrigins.length === 0) {
      return callback(null, true);
    }

    if (config.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(morgan(config.logLevel));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    name: config.appName,
    version: '1.0.0'
  });
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

app.use('/health', healthRouter);
app.use('/api/contact', contactRouter);
app.use('/api/join', joinRouter);
app.use('/api/advisor', advisorRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/admin', adminRouter);
app.use('/api/dashboard', adminSession, dashboardRouter);

// Serve index.html for any unknown routes (SPA support) - MUST be after API routes
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use((err, _req, res, _next) => {
  // Keep the message terse while logging the actual error for debugging
  // eslint-disable-next-line no-console
  console.error(err);

  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed by CORS policy' });
  }

  return res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
