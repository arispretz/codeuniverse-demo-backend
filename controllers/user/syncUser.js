import { User } from '../../models/User.js';

/**
 * @fileoverview Synchronizes a Firebase-authenticated user with MongoDB.
 * If the user already exists, returns the existing record.
 * Otherwise, creates a new user with a default role.
 * @module controllers/user/syncUser
 */

/**
 * Synchronizes a Firebase-authenticated user with MongoDB.
 *
 * @async
 * @function syncUser
 * @param {Request} req - Express request object containing user and email.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with user data or error message.
 */
export async function syncUser(req, res) {
  const { email } = req.body;
  const uid = req.user.uid; // Using uid as the standard identifier

  try {
    /**
     * 🔍 Search for user by Firebase UID.
     */
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      return res.status(200).json({
        message: 'User already synchronized',
        user: {
          uid: user.uid,
          email: user.email,
          role: user.role,
        },
      });
    }

    /**
     * 🆕 Create new user with default role "guest".
     */
    user = new User({
      firebaseUid: uid,
      email,
      role: 'guest',
    });

    await user.save();

    return res.status(201).json({
      message: 'User synchronized with MongoDB',
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Error synchronizing user:', error.message);
    return res.status(500).json({ error: 'Internal error while synchronizing user' });
  }
}
