import admin from "firebase-admin";
import { User } from "../models/User.js";

/**
 * @fileoverview Middleware and controller for Firebase authentication and avatar retrieval.
 * Provides token validation using Firebase Admin SDK and retrieves user avatars from MongoDB.
 * @module controllers/avatarController
 */

/**
 * Middleware to validate Firebase token.
 *
 * @async
 * @function verifyFirebaseToken
 * @param {Request} req - Express request object containing authorization header.
 * @param {Response} res - Express response object used to send results.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Calls next middleware or sends error response.
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("❌ Error verifying token:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

/**
 * Controller to retrieve avatars from MongoDB Atlas.
 *
 * @async
 * @function getAvatars
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with user avatars or error message.
 */
export const getAvatars = async (req, res) => {
  try {
    /**
     * 🔹 Query all users from the collection selecting only name and avatarUrl.
     */
    const users = await User.find({}, "name avatarUrl").lean();

    /**
     * 🔹 Transform result into { name, avatarUrl } format.
     */
    const avatars = users.map((u) => ({
      name: u.name,
      avatarUrl: u.avatarUrl || null,
    }));

    res.json(avatars);
  } catch (err) {
    console.error("❌ Error retrieving avatars:", err);
    res.status(500).json({ error: "Error retrieving avatars" });
  }
};
