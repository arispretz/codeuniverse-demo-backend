/**
 * @fileoverview Controller for assistant reply operations.
 * Handles requests to generate replies using the FastAPI model service.
 * @module controllers/assistantController
 */

import { runFastapiModel } from '../services/fastapiModelRunner.js';

/**
 * Handles POST /assistant.
 * Calls FastAPI model to generate assistant reply based on provided input.
 *
 * @async
 * @function generateAssistantReply
 * @param {Request} req - Express request object containing prompt and metadata.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with assistant reply or error message.
 */
export const generateAssistantReply = async (req, res) => {
  const { prompt, language, user_id, code, user_level } = req.body;

  // ✅ Required field validation
  if (!prompt || !language || !user_id) {
    return res.status(400).json({ error: 'Missing required fields: prompt, language, user_id' });
  }

  try {
    /**
     * 🔗 Call FastAPI service with all provided fields.
     */
    const response = await runFastapiModel({
      prompt,
      language,
      code,
      user_id,
      user_level,
    });

    /**
     * 📦 Always return { response } so frontend can consume consistently.
     */
    res.json({ response });
  } catch (error) {
    /**
     * ❌ Log full error with stack trace.
     */
    console.error('❌ Error generating assistant reply:', error);

    /**
     * 🛑 Return clear error message to frontend.
     * Include detailed error only in development mode.
     */
    res.status(500).json({
      error: 'Assistant service unavailable',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
