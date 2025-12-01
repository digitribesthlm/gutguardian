import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const dbName = process.env.DATABASE_NAME;

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error('Please define MONGODB_URI in your environment variables');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

