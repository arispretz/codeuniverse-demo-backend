/**
 * @fileoverview Controller for user registration.
 * Handles user registration by verifying Firebase ID tokens,
 * assigning roles, and creating user records in MongoDB.
 * @module controllers/registerController
 */

import admin from 'firebase-admin';
import { User } from '../models/User.js';
import { assignRole } from '../utils/roleUtils.js';

/**
 * Handles POST /register.
 * Registers a new user with Firebase and MongoDB.
 *
 * @async
 * @function registerUser
 * @param {Request} req - Express request object containing idToken, username, and invitationCode.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message and assigned role or error message.
 */
export const registerUser = async (req, res) => {
  const { idToken, username, invitationCode } = req.body;

  try {
    // ✅ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = decoded.email;
    const firebaseUid = decoded.uid;

    // ✅ Assign role based on email and invitation code
    const role = assignRole(email, invitationCode);

    // ✅ Create user in MongoDB
    const user = await User.create({
      firebaseUid,
      username,
      email,
      role,
      joinedAt: new Date(),
    });

    res.status(201).json({ message: 'User created successfully', role });
  } catch (error) {
    console.error('❌ Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};
