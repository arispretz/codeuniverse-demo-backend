/**
 * @fileoverview Controller for linting code.
 * Validates the programming language, runs linting, and returns diagnostic messages.
 * @module controllers/lintController
 */

import { lintCode } from '../lint/lintRunner.js';

/**
 * Handles POST /lint.
 * Validates the language, runs linting, and returns linting messages.
 *
 * @async
 * @function lintCodeController
 * @param {Request} req - Express request object containing code and language.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with linting messages or error message.
 */
export const lintCodeController = async (req, res) => {
  const { code, language } = req.body;

  // ✅ Validate supported languages
  if (!['javascript', 'python'].includes(language)) {
    return res.status(400).json({ error: 'Only JavaScript and Python are supported.' });
  }

  try {
    /**
     * 🔍 Run linting process for provided code and language.
     */
    const messages = await lintCode(code, language);

    res.json({ messages });
  } catch (err) {
    /**
     * ❌ Log error and return internal server error response.
     */
    console.error('❌ Linting error:', err);
    res.status(500).json({ error: 'Failed to lint code.' });
  }
};
