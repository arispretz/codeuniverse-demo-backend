/**
 * @fileoverview Express routes for user profile management.
 * Defines endpoints for retrieving and updating user profile information.
 * @module routes/userProfileRoutes
 */

import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userProfileController.js';

export const userProfileRouter = express.Router();

/**
 * GET /profile/:uid
 * Endpoint to retrieve a user profile by UID.
 * The frontend sends { uid }
 * The backend responds with { userProfile }
 */
userProfileRouter.get('/profile/:uid', getUserProfile);

/**
 * POST /profile/update
 * Endpoint to update a user's preferred style or profile details.
 * The frontend sends { uid, preferences }
 * The backend responds with { success, updatedProfile }
 */
userProfileRouter.post('/profile/update', updateUserProfile);
