/**
 * @fileoverview Express routes for avatar management.
 * Defines protected endpoints for retrieving user avatars.
 * @module routes/avatarRoutes
 */

import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { getAvatars } from "../controllers/avatarController.js";

export const avatarRouter = express.Router();

/**
 * GET /avatars
 * Protected route to retrieve available avatars.
 * Requires Firebase token verification before accessing the resource.
 */

avatarRouter.get("/", auth, getAvatars);
