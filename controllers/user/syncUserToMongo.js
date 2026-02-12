/**
 * @fileoverview Middleware to ensure a Firebase-authenticated user is synchronized with MongoDB.
 * If the user does not exist, a new record is created with a default role.
 * @module controllers/user/syncUserToMongo
 */

import { User } from '../../models/User.js';

/**
 * Middleware that checks if a Firebase-authenticated user exists in MongoDB.
 * If not, creates a new user with default role "guest".
 *
 * @async
 * @function syncUserToMongo
 * @param {Request} req - Express request object containing Firebase user data.
 * @param {Response} res - Express response object used to send results.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Calls next middleware or sends error response.
 */
export async function syncUserToMongo(req, res, next) {
  try {
    const uid = req.user.uid; // Using uid as the standard identifier
    const email = req.user.email;

    /**
     * 🔍 Search for user by Firebase UID.
     */
    const existingUser = await User.findOne({ firebaseUid: uid });

    if (!existingUser) {
      /**
       * 🆕 Create new user with default role "guest".
       */
      const user = new User({
        firebaseUid: uid,
        email,
        role: 'guest',
      });

      await user.save();
      console.log(`✅ User synchronized: ${email}`);
    }

    next();
  } catch (error) {
    console.error('❌ Error synchronizing user:', error.message);
    res.status(500).json({ error: 'Error synchronizing user' });
  }
}
