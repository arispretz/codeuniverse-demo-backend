/**
 * @fileoverview Establishes and monitors connection to MongoDB Atlas.
 * Provides a reusable function to connect to MongoDB using Mongoose,
 * with automatic reconnection and error handling.
 * @module DB/db
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Sets up listeners for disconnection and error events.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established.
 */
export async function connectDB() {
  if (!mongoUri) {
    console.error('❌ Missing environment variable: MONGO_URI');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.DB_NAME || 'codeuniverse',
      // Additional options can be added here if needed
    });

    console.log('✅ MongoDB Atlas connection established');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Retrying...');
    connectDB();
  });

  mongoose.connection.on('error', (err) => {
    console.error('🚨 MongoDB connection error:', err.message);
  });
}
