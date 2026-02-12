/**
 * @fileoverview Express routes for code generation via external ML service.
 * Defines endpoints for generating code snippets using machine learning models.
 * @module routes/generateRoutes
 */

import express from 'express';
import { generateCode } from '../controllers/generateController.js';

export const generateRouter = express.Router();

/**
 * POST /generate
 * Endpoint to generate code using an external ML service.
 * The frontend sends { prompt, language, user_id }
 * The backend responds with { generatedCode }
 */
generateRouter.post('/', generateCode);
