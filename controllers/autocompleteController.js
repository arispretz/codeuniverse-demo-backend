/**
 * @fileoverview Controller for code autocomplete operations.
 * Provides a simple code suggestion, stores usage metrics, and updates user profile.
 * @module controllers/autocompleteController
 */

import { UserProfile } from '../models/UserProfile.js';

/**
 * Handles POST /autocomplete.
 * Generates a basic code suggestion, updates user profile with preferences and usage metrics.
 *
 * @async
 * @function generateAutocomplete
 * @param {Request} req - Express request object containing code, language, and user_id.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with code suggestion or error message.
 */
export const generateAutocomplete = async (req, res) => {
  const { code, language, user_id } = req.body;

  // ✅ Required field validation
  if (!code || !language || !user_id) {
    return res.status(400).json({ error: 'Missing required fields: code, language, user_id' });
  }

  try {
    /**
     * 💡 Simple code suggestion example.
     */
    const suggestion = `console.log("Hello World");`;

    /**
     * 📝 Update user profile with language preference and usage metrics.
     */
    await UserProfile.findOneAndUpdate(
      { user_id },
      {
        $set: { preferred_language: language, last_used: new Date() },
        $addToSet: { style_notes: "uses console.log" },
      },
      { upsert: true }
    );

    res.json({ suggestion });
  } catch (error) {
    /**
     * ❌ Log error and return internal server error response.
     */
    console.error('❌ Autocomplete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
