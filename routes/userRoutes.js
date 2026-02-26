/**
 * @fileoverview Express routes for user registration, profile access, synchronization, and admin actions.
 * Defines endpoints for public user info, authentication, synchronization with Firebase, and role management.
 * @module routes/userRoutes
 */

import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { registerUser, getCurrentUser, getUsers, getPublicUsers, updateUserTeam } from '../controllers/userController.js';
import { updateUserRoleController } from '../controllers/roleController.js';
import { syncUser } from '../controllers/user/syncUser.js';
import { syncUserToMongo } from '../controllers/user/syncUserToMongo.js';

export const userRouter = express.Router();

/* -------------------- 🔓 Public Routes -------------------- */

/**
 * GET /public
 * Public route to list basic user info.
 * Returns { username, email, _id, team } for all users.
 */
userRouter.get('/public', getPublicUsers);

/**
 * POST /register
 * Public route to register a new user.
 * All new users start with role "guest".
 */
userRouter.post('/register', registerUser);

/* -------------------- 🔐 Authenticated Routes -------------------- */

/**
 * POST /sync-user
 * Syncs user data from Firebase to MongoDB.
 */
userRouter.post('/sync-user', auth, syncUser);

/**
 * GET /me
 * Returns the current authenticated user's profile.
 */
userRouter.get('/me', auth, getCurrentUser);

/**
 * GET /dashboard
 * Protected route that ensures user is synced before accessing dashboard.
 */
userRouter.get('/dashboard', auth, syncUserToMongo, (req, res) => {
  res.json({ message: 'Welcome to the dashboard' });
});

/* -------------------- 🛡️ Admin Routes -------------------- */

/**
 * GET /admin
 * Route to list all users.
 * Requires authentication.
 */
userRouter.get('/admin', auth, getUsers);

/**
 * PATCH /users/:firebaseUid/role
 * Route to update a user's role.
 * Requires authentication.
 */
userRouter.patch('/:firebaseUid/role', auth, updateUserRoleController);

/**
 * PATCH /users/:firebaseUid/team
 * Route to update a user's team.
 * Requires authentication.
 */
userRouter.patch('/:firebaseUid/team', auth, updateUserTeam);
