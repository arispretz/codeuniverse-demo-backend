/**
 * @fileoverview Controller for executing code via Judge0 API.
 * Provides functionality to send source code to Judge0 for execution and return the output.
 * @module controllers/codeController
 */

import axios from 'axios';

/**
 * Executes code using Judge0 API.
 *
 * @async
 * @function runCode
 * @param {Request} req - Express request object containing source code and language ID.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with code execution output or error message.
 */
export const runCode = async (req, res) => {
  const { source_code, language_id } = req.body;

  // ✅ Validate required environment variables
  if (!process.env.RAPIDAPI_KEY || !process.env.JUDGE0_URL) {
    console.error('❌ Missing environment variables: RAPIDAPI_KEY or JUDGE0_URL');
    return res.status(500).json({ error: 'Server misconfiguration: RAPIDAPI_KEY or JUDGE0_URL not set' });
  }

  try {
    /**
     * 🔗 Send code execution request to Judge0 API.
     */
    const { data } = await axios.post(
      `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      { source_code, language_id },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': new URL(process.env.JUDGE0_URL).host, 
        },
      }
    );

    /**
     * 📦 Extract output from Judge0 response.
     */
    const output = data.stdout || data.stderr || 'No output';
    res.json({ output });
  } catch (error) {
    /**
     * ❌ Log error and return internal server error response.
     */
    console.error('❌ Error executing code via Judge0:', error.message);
    res.status(500).json({ error: 'Internal error while executing code' });
  }
};
