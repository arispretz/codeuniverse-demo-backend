/**
 * @fileoverview Controller for code generation operations.
 * Sends prompts to FastAPI service, stores usage metrics, and updates user profiles.
 * @module controllers/generateController
 */

import { runFastapiGenerate } from "../services/fastapiModelRunner.js";
import { UserProfile } from "../models/UserProfile.js";

export const generateCode = async (req, res) => {
  const { prompt, language, user_id } = req.body;

  if (!prompt || !language) {
    return res.status(400).json({ output: "error: Missing required fields: prompt, language" });
  }

  try {
    const code = await runFastapiGenerate({
      prompt,
      language,
      token: req.headers.authorization?.replace("Bearer ", ""),
    });

    if (user_id) {
      await UserProfile.findOneAndUpdate(
        { user_id },
        {
          $set: { preferred_language: language, last_used: new Date() },
          $addToSet: { style_notes: "generated code" },
        },
        { upsert: true }
      );
    }

    res.json({ code });
  } catch (error) {
    console.error("❌ Generate error:", error.message);
    res.status(500).json({ output: `error: ${error.message}` });
  }
};
