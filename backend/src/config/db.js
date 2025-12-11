const { MongoClient, ServerApiVersion } = require('mongodb');
const { config } = require('./env');

let client;
let database;

const shouldSkipConnection = () => {
  return !config.mongoUri || config.mongoUri.includes('<db_password>');
};

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('contact_requests').createIndex({ createdAt: -1 }),
    db.collection('join_requests').createIndex({ createdAt: -1 }),
    db.collection('advisor_applications').createIndex({ createdAt: -1 }),
    db.collection('newsletter_subscriptions').createIndex({ email: 1 }, { unique: false }),
    db.collection('newsletter_subscriptions').createIndex({ createdAt: -1 })
  ]);
}

async function connectToDatabase() {
  if (shouldSkipConnection()) {
    // eslint-disable-next-line no-console
    console.warn('Mongo URI missing or contains placeholder. Skipping DB connection.');
    return null;
  }

  client = new MongoClient(config.mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });
  await client.connect();
  database = client.db(config.mongoDbName);
  await ensureIndexes(database);

  // eslint-disable-next-line no-console
  console.log(`Connected to MongoDB database "${database.databaseName}"`);
  return database;
}

function getDb() {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return database;
}

function isDbConnected() {
  return Boolean(database);
}

async function disconnectFromDatabase() {
  if (client) {
    await client.close();
    client = null;
    database = null;
    // eslint-disable-next-line no-console
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  getDb,
  isDbConnected
};
