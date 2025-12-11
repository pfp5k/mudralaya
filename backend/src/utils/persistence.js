const { getDb, isDbConnected } = require('../config/db');

async function persistDocument(collectionName, payload) {
  if (!isDbConnected()) {
    // eslint-disable-next-line no-console
    console.warn(`Database not connected. Skipping persistence for collection "${collectionName}".`);
    return { persisted: false };
  }

  const doc = {
    ...payload,
    createdAt: new Date()
  };

  const result = await getDb().collection(collectionName).insertOne(doc);

  return {
    persisted: true,
    id: result.insertedId,
    createdAt: doc.createdAt
  };
}

module.exports = {
  persistDocument
};
