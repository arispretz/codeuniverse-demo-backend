/**
 * @fileoverview Controller for code autocomplete operations.
 * Calls FastAPI autocomplete endpoint, stores usage metrics, and updates user profile.
 * @module controllers/autocompleteController
 */

import { runFastapiAutocomplete } from "../services/fastapiModelRunner.js";
import { UserProfile } from "../models/UserProfile.js";

export const generateAutocomplete = async (req, res) => {
  const { code, language, user_id } = req.body;

  if (!code || !language) {
    return res.status(400).json({ output: "error: Missing required fields: code, language" });
  }

  try {
    const suggestion = await runFastapiAutocomplete({
      code,
      language,
      token: req.headers.authorization?.replace("Bearer ", ""),
    });

    if (user_id) {
      await UserProfile.findOneAndUpdate(
        { user_id },
        {
          $set: { preferred_language: language, last_used: new Date() },
          $addToSet: { style_notes: "used autocomplete" },
        },
        { upsert: true }
      );
    }

    res.json({ suggestion });
  } catch (error) {
    console.error("❌ Autocomplete error:", error.message);
    res.status(500).json({ output: `error: ${error.message}` });
  }
};
