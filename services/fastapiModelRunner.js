/**
 * @fileoverview Service for interacting with the external FastAPI model.
 * Provides a function to send prompts, code, and metadata to the model and receive responses.
 * @module services/fastapiModelRunner
 */

import axios from 'axios';

/**
 * Calls the external FastAPI model with the provided parameters.
 *
 * @async
 * @function runFastapiModel
 * @param {Object} params - Parameters for the model request.
 * @param {string} params.prompt - The text prompt to send to the model.
 * @param {string} params.language - Programming language context.
 * @param {string} params.code - Code snippet or content to process.
 * @param {string} params.user_id - Unique identifier of the user.
 * @param {string} params.user_level - User level or experience indicator.
 * @returns {Promise<string>} The model's response text.
 * @throws {Error} If the ASSISTANT_URL environment variable is not defined or the request fails.
 *
 * @example
 * const reply = await runFastapiModel({
 *   prompt: "Explain recursion in Python 🤓",
 *   language: "python",
 *   code: "def factorial(n): return 1 if n==0 else n*factorial(n-1)",
 *   user_id: "12345",
 *   user_level: "beginner"
 * });
 * console.log(reply); // -> "Recursion is when a function calls itself..."
 */
export async function runFastapiModel({ prompt, language, code, user_id, user_level }) {
  if (!process.env.ASSISTANT_URL) {
    throw new Error("❌ ASSISTANT_URL environment variable is not defined. Please set it in your .env file.");
  }

  const { data } = await axios.post(
    process.env.ASSISTANT_URL,
    { prompt, language, code, user_id, user_level },
    { timeout: 30000 } // ⏱ Reasonable timeout for CPU-bound tasks
  );

  return data.response || data.reply;
}
