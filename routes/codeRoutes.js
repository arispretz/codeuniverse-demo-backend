/**
 * @fileoverview Express routes for executing code via Judge0 and managing snippets.
 * Defines endpoints for running code and handling snippet operations.
 * @module routes/codeRoutes
 */

import express from 'express';
import { runCode } from '../controllers/codeController.js';

export const codeRouter = express.Router();

/**
 * POST /run
 * Endpoint to execute code using the Judge0 API.
 * The frontend sends { source_code, language_id, stdin }
 * The backend responds with { output, status }
 */
codeRouter.post('/run', runCode);
