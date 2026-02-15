/**
 * @fileoverview Service for interacting with the external AI Assistant API (FastAPI).
 * Provides functions to send prompts and receive responses.
 * @module services/assistantService
 */

import axios from "axios";

export async function callAssistant(prompt, token) {
  if (!process.env.ML_SERVICE_URL) {
    throw new Error("❌ ML_SERVICE_URL environment variable is not defined. Please set it in your .env file.");
  }

  const { data } = await axios.post(
    `${process.env.ML_SERVICE_URL}/reply`,
    { prompt },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data.response || data.reply;
}
