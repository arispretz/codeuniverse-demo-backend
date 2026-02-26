/**
 * @fileoverview Initializes Firebase Admin SDK using credentials from environment variables.
 * Ensures that Firebase is properly configured before the application starts.
 * If credentials are missing or invalid, the process will exit with an error.
 * @module config/firebase
 */

import dotenv from 'dotenv';
dotenv.config();

import admin from 'firebase-admin';

let firebaseCredentials;

try {
  /**
   * 🔑 Firebase credentials loaded from environment variable.
   * Must be provided as a JSON string in FIREBASE_CREDENTIAL_JSON.
   * @type {object}
   */
  firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);
} catch (error) {
  console.error('❌ Failed to parse Firebase credentials:', error.message);
  process.exit(1);
}

try {
  /**
   * 🔐 Initializes Firebase Admin SDK with provided credentials.
   */
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

/**
 * Wrapper to verify users in Firebase.
 * @async
 * @function verifyFirebaseUser
 * @param {string} uid - Firebase user ID.
 * @returns {Promise<admin.auth.UserRecord>} Firebase user record.
 * @throws {Error} If user cannot be retrieved.
 */
export async function verifyFirebaseUser(uid) {
  try {
    const user = await admin.auth().getUser(uid);
    return user;
  } catch (err) {
    throw err;
  }
}

/**
 * Exported Firebase Admin SDK instance.
 * @type {admin.App}
 */
export { admin };
