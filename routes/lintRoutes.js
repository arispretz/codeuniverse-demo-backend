/**
 * @fileoverview Express routes for linting code.
 * Defines endpoints for analyzing and validating code syntax and style.
 * @module routes/lintRoutes
 */

import express from 'express';
import { lintCodeController } from '../controllers/lintController.js';

export const lintRouter = express.Router();

/**
 * POST /lint
 * Endpoint to lint code for supported languages (JavaScript, Python).
 * The frontend sends { code, language }
 * The backend responds with { issues, warnings, suggestions }
 */
lintRouter.post('/lint', lintCodeController);
