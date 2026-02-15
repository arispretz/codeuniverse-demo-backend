/**
 * @fileoverview Express routes for assistant replies using FastAPI model.
 * Defines endpoints for generating assistant responses.
 * @module routes/assistantRoutes
 */

import express from "express";
import { generateAssistantReply } from "../controllers/assistantController.js";
import { generateCode } from "../controllers/generateController.js";
import { generateAutocomplete } from "../controllers/autocompleteController.js";

export const assistantRouter = express.Router();

/**
 * POST /assistant/reply
 * Endpoint to generate assistant reply (mentor mode).
 * The frontend sends { prompt, code, language, user_level }
 * The backend responds with { response }
 */
assistantRouter.post("/reply", generateAssistantReply);

/**
 * POST /assistant/generate
 * Endpoint to generate code using FastAPI.
 * The frontend sends { prompt, language }
 * The backend responds with { code }
 */
assistantRouter.post("/generate", generateCode);

/**
 * POST /assistant/autocomplete
 * Endpoint to generate code autocomplete suggestions using FastAPI.
 * The frontend sends { code, language }
 * The backend responds with { suggestion }
 */
assistantRouter.post("/autocomplete", generateAutocomplete);
