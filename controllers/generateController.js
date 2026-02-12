/**
 * @fileoverview Controller for code generation operations.
 * Sends prompts to the ML service, stores usage metrics, and updates user profiles.
 * @module controllers/generateController
 */

import axios from 'axios';
import { UserProfile } from '../models/UserProfile.js';

/**
 * Handles POST /generate.
 * Sends prompt to ML service, stores metrics, and updates user profile.
 *
 * @async
 * @function generateCode
 * @param {Request} req - Express request object containing prompt, language, and user_id.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with generated code or error message.
 */
export const generateCode = async (req, res) => {
  const { prompt, language, user_id } = req.body;

  // ✅ Required field validation
  if (!prompt || !language || !user_id) {
    return res.status(400).json({ error: 'Missing required fields: prompt, language, user_id' });
  }

  // ✅ Validate ML service URL from environment
  if (!process.env.ML_SERVICE_URL) {
    console.error('❌ Missing environment variable: ML_SERVICE_URL');
    return res.status(500).json({ error: 'Server misconfiguration: ML_SERVICE_URL not set' });
  }

  try {
    /**
     * 🔗 Call external ML service for code generation.
     */
    const { data } = await axios.post(`${process.env.ML_SERVICE_URL}/generate`, {
      prompt,
      language,
      user_id,
    });

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

    res.json({ code: data.code });
  } catch (error) {
    /**
     * ❌ Log error and return internal server error response.
     */
    console.error('❌ Generate error:', error.message);
    res.status(500).json({ error: 'Error connecting to ML service' });
  }
};
