/**
 * @fileoverview Controller for user profile operations.
 * Provides endpoints to retrieve and update user profile information.
 * @module controllers/userProfileController
 */

import { UserProfile } from '../models/UserProfile.js';

/**
 * Retrieves a user profile by UID.
 *
 * @async
 * @function getUserProfile
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with user profile or error message.
 */
export const getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user_id: req.params.uid });
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('❌ Error retrieving profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Updates a user profile preferred style.
 *
 * @async
 * @function updateUserProfile
 * @param {Request} req - Express request object containing user_id and preferred_style in body.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { user_id, preferred_style } = req.body;
    if (!user_id || !preferred_style) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await UserProfile.findOneAndUpdate(
      { user_id },
      { $set: { preferred_style } },
      { upsert: true }
    );

    res.json({ message: '✅ Preferred style updated successfully' });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
