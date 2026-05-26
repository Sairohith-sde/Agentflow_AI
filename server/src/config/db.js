import mongoose from 'mongoose';
import { env } from './env.js';

let dbMode = 'memory';

export async function connectDatabase() {
  if (!env.mongoUri) {
    dbMode = 'memory';
    return { mode: dbMode, connected: false };
  }

  try {
    const connectPromise = mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });

    await Promise.race([
      connectPromise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('MongoDB connection timed out after 5 seconds')), 5000);
      })
    ]);

    dbMode = 'mongo';
    return { mode: dbMode, connected: true };
  } catch (error) {
    console.warn(`MongoDB connection failed, falling back to memory: ${error.message}`);
    dbMode = 'memory';
    return { mode: dbMode, connected: false, error: error.message };
  }
}

export function getDbMode() {
  return dbMode;
}
