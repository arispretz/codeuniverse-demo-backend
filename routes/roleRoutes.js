/**
 * @fileoverview Express routes for user role management.
 * @module routes/roleRoutes
 */

import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import { updateUserRole } from '../controllers/roleController.js';

export const roleRouter = express.Router();

/**
 * PATCH /users/:firebaseUid/role
 * Admin-only route to update a user's role.
 */
roleRouter.patch('/users/:firebaseUid/role', auth, checkRole(['admin']), updateUserRole);
