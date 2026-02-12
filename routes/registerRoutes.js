/**
 * @fileoverview Express routes for user registration.
 * Defines endpoints for creating new user accounts.
 * @module routes/registerRoutes
 */

import express from 'express';
import { registerUser } from '../controllers/registerController.js';

export const registerRouter = express.Router();

/**
 * POST /register
 * Endpoint to register a new user.
 * Integrates Firebase authentication and MongoDB storage.
 * The frontend sends { email, password, displayName }
 * The backend responds with { user, token }
 */
registerRouter.post('/register', registerUser);
