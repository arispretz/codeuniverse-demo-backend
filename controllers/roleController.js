/**
 * @fileoverview Role Controller
 * Provides endpoints to assign and update user roles in MongoDB.
 * Delegates business logic to the userService and handles HTTP responses.
 * Emits a role change event via Socket.IO when applicable.
 *
 * @module controllers/roleController
 */

import { updateUserRole } from '../services/userService.js';

/**
 * Assigns a role to a user in MongoDB.
 *
 * @async
 * @function assignRole
 * @param {Request} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.firebaseUid - Firebase UID of the target user.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.role - New role to assign to the user.
 * @param {Object} req.user - Authenticated user making the request.
 * @param {string} req.user.role - Role of the requester (must be 'admin').
 * @param {string} req.user.firebaseUid - Firebase UID of the requester.
 * @param {Object} req.io - Optional Socket.IO instance for emitting events.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with updated user data or error message.
 *
 * @throws {Error} If requester is not admin, role is invalid, or user not found.
 *
 * @example
 * // PATCH /api/users/:firebaseUid/role
 * {
 *   "role": "developer"
 * }
 *
 * Response:
 * {
 *   "message": "Role developer assigned to user abc123",
 *   "user": {
 *     "firebaseUid": "abc123",
 *     "email": "user@example.com",
 *     "role": "developer"
 *   }
 * }
 */
export const updateUserRoleController = async (req, res) => { 
  try {
    const { firebaseUid } = req.params;
    const { role } = req.body;
    const result = await updateUserRole(req.user, firebaseUid, role);

    if (result.roleChanged) {
      req.io?.emit('roleChanged', { uid: firebaseUid, newRole: role });
    }

    res.json({
      message: `Role ${role} assigned to user ${firebaseUid}`,
      user: result.user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
