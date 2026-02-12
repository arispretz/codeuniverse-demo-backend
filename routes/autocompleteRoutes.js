/**
 * @fileoverview Express routes for code autocomplete suggestions.
 * Defines endpoints for generating code completions.
 * @module routes/autocompleteRoutes
 */

import express from 'express';
import { generateAutocomplete } from '../controllers/autocompleteController.js';

export const autocompleteRouter = express.Router();

/**
 * POST /autocomplete
 * Endpoint to generate code autocomplete suggestions.
 * The frontend sends { code, language, user_id }
 * The backend responds with { suggestions }
 */
autocompleteRouter.post('/', generateAutocomplete);
