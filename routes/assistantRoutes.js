/**
 * @fileoverview Express routes for assistant replies using FastAPI model.
 * Defines endpoints for generating assistant responses.
 * @module routes/assistantRoutes
 */

import express from "express";
import { generateAssistantReply } from "../controllers/assistantController.js";
import { generateCode } from "../controllers/generateController.js";
import { generateAutocomplete } from "../controllers/autocompleteController.js";
import { generateCodeReplyOnly } from "../controllers/replyCodeOnlyController.js";

export const assistantRouter = express.Router();

assistantRouter.post("/reply", generateAssistantReply);
assistantRouter.post("/reply-code-only", generateCodeReplyOnly);
assistantRouter.post("/generate", generateCode);
assistantRouter.post("/autocomplete", generateAutocomplete);
