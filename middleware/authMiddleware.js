/**
 * @fileoverview Authentication middleware using Firebase Admin SDK.
 * Verifies Firebase ID tokens, ensures user exists in MongoDB,
 * and attaches user information to the request object.
 * @module middleware/authMiddleware
 */

import admin from 'firebase-admin';
import { User } from '../models/User.js';

/**
 * Middleware to authenticate requests using Firebase ID token.
 *
 * @async
 * @function auth
 * @param {Request} req - Express request object containing authorization header.
 * @param {Response} res - Express response object used to send results.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Calls next() if authentication succeeds, otherwise sends error response.
 */
export async function auth(req, res, next) {
  console.log('🔐 Auth middleware triggered');

  const authHeader = req.headers.authorization;
  console.log('📥 Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ Request without token:', req.method, req.path);
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    // ✅ Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    console.log('🧾 Decoded token:', decodedToken);

    if (!uid || !email) {
      console.warn('⚠️ UID or email missing in decoded token');
      return res.status(400).json({ error: 'Invalid token: UID or email not found' });
    }

    // ✅ Find or create user in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log('🔄 Updating existing user with new firebaseUid');
        existingUser.firebaseUid = uid;
        await existingUser.save();
        user = existingUser;
      } else {
        console.log('🆕 Creating new guest user');
        user = await User.create({
          firebaseUid: uid,
          email,
          username: email.split('@')[0],
          role: 'guest',
        });
      }
    }

    // ✅ Attach user info to request
    req.user = {
      _id: user._id,
      uid,
      firebaseUid: user.firebaseUid,
      email: user.email,
      role: user.role,
    };

    console.log(`✅ Authenticated user: ${user.email} (${user.role})`);
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
