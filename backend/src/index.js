const http = require('http');

console.log('Starting application...'); // Debug log for Azure
const app = require('./app');
const { config } = require('./config/env');
const { connectToDatabase, disconnectFromDatabase } = require('./config/db');

const server = http.createServer(app);

const onListening = () => {
  // eslint-disable-next-line no-console
  console.log(`${config.appName} listening on port ${config.port}`);
};

const onError = (err) => {
  // eslint-disable-next-line no-console
  console.error('Server failed to start', err);
  process.exit(1);
};

async function start() {
  // Start server immediately to satisfy health checks
  try {
    server.listen(config.port);
    server.on('listening', onListening);
    server.on('error', onError);
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }

  // Connect to DB in background
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('Failed to connect to database', err);
  }
}

const shutdown = () => {
  // eslint-disable-next-line no-console
  console.log('Shutting down gracefully...');
  server.close(async () => {
    await disconnectFromDatabase();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
