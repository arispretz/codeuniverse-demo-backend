/**
 * @fileoverview Service for interacting with the external AI Assistant API.
 * Provides a function to send prompts and receive responses.
 * @module services/assistantService
 */

import axios from 'axios';

/**
 * Calls the external AI Assistant service with a given prompt.
 *
 * @async
 * @function callAssistant
 * @param {string} prompt - The text prompt to send to the assistant.
 * @returns {Promise<string>} The assistant's response text.
 * @throws {Error} If the ASSISTANT_URL environment variable is not defined or the request fails.
 *
 * @example
 * const reply = await callAssistant("Explain recursion in simple terms 🤓");
 * console.log(reply); // -> "Recursion is when a function calls itself..."
 */
export async function callAssistant(prompt) {
  if (!process.env.ASSISTANT_URL) {
    throw new Error("❌ ASSISTANT_URL environment variable is not defined. Please set it in your .env file.");
  }

  const { data } = await axios.post(
    `${process.env.ASSISTANT_URL}/reply`,
    { prompt }
  );

  return data.response || data.reply;
}
