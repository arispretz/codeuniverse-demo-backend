/**
 * @fileoverview Express routes for assistant replies using FastAPI model.
 * Defines endpoints for generating assistant responses.
 * @module routes/assistantRoutes
 */

import express from 'express';
import { generateAssistantReply } from '../controllers/assistantController.js';

export const assistantRouter = express.Router();

/**
 * POST /assistant
 * Endpoint to generate assistant reply using FastAPI model.
 * The frontend (AssistantSidebar) sends { prompt, code, language, user_id, user_level }
 * The backend responds with { response }
 */
assistantRouter.post('/assistant', generateAssistantReply);
