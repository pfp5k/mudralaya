const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: false,
  debug: false
});

const parseOrigins = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const config = {
  port: Number(process.env.PORT) || 5000,
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN) || [],
  logLevel: process.env.LOG_LEVEL || 'dev',
  mongoUri: process.env.MONGO_URI || '',
  mongoDbName: process.env.MONGO_DB_NAME || 'mudralya',
  dashboardApiKey: process.env.DASHBOARD_API_KEY || '',
  dashboardAdminUser: process.env.DASHBOARD_ADMIN_USER || '',
  dashboardAdminPass: process.env.DASHBOARD_ADMIN_PASS || '',
  appName: 'Mudralya API'
};

module.exports = { config };
