/**
 * @fileoverview Controller for assistant reply operations.
 * Handles requests to generate replies using the FastAPI model service.
 * @module controllers/assistantController
 */

import { runFastapiReply } from "../services/fastapiModelRunner.js";

export const generateAssistantReply = async (req, res) => {
  const { prompt, language, code, user_id, user_level } = req.body;

  if (!prompt || !language) {
    return res.status(400).json({ output: "error: Missing required fields: prompt, language" });
  }

  try {
    const response = await runFastapiReply({
      prompt,
      language,
      code,
      user_id,
      user_level,
      token: req.headers.authorization?.replace("Bearer ", ""),
    });

    res.json({ response });
  } catch (error) {
    console.error("❌ Error generating assistant reply:", error);
    res.status(500).json({ output: `error: ${error.message}` });
  }
};
