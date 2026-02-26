/**
 * @fileoverview Controller for avatar retrieval.
 * Retrieves user avatars from MongoDB.
 * @module controllers/avatarController
 */
import { User } from "../models/User.js";

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
