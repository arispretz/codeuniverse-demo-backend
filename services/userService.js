/**
 * @fileoverview User service for role management.
 * Provides functionality to update a user's role in MongoDB.
 * Ensures that only admins can change roles, prevents self-demotion from admin,
 * validates roles against a whitelist, and emits a role change event if applicable.
 *
 * @module services/userService
 */

import { User } from '../models/User.js';

/**
 * Updates the role of a user in MongoDB.
 *
 * @async
 * @function updateUserRole
 * @param {Object} requester - The user making the request.
 * @param {string} requester.role - Role of the requester (must be 'admin').
 * @param {string} requester.firebaseUid - Firebase UID of the requester.
 * @param {string} targetUid - Firebase UID of the user whose role will be updated.
 * @param {string} newRole - The new role to assign to the user.
 * @returns {Promise<{user: Object, roleChanged: boolean}>} 
 * Returns the updated user object and a flag indicating if the role was changed.
 *
 * @throws {Error} If requester is not admin, if attempting self-demotion,
 * if the role is invalid, or if the user is not found.
 *
 * @example
 * const result = await updateUserRole(req.user, 'targetFirebaseUid', 'developer');
 * console.log(result.user.role); // 'developer'
 */
export const updateUserRole = async (requester, targetUid, newRole) => {
  // 🚫 Ensure requester is admin
  if (requester.role !== 'admin') {
    throw new Error('Only admins can change roles');
  }

  // 🚫 Prevent self-demotion from admin
  if (requester.firebaseUid === targetUid && newRole.toLowerCase() !== 'admin') {
    throw new Error('You cannot remove your own admin role');
  }

  // ✅ Validate role against allowed roles
  const validRoles = ['admin', 'manager', 'developer', 'guest', 'ai_assistant'];
  if (!validRoles.includes(newRole.toLowerCase())) {
    throw new Error(`Invalid role: ${newRole}`);
  }

  // 🔍 Find user by Firebase UID
  const user = await User.findOne({ firebaseUid: targetUid });
  if (!user) throw new Error('User not found');

  const previousRole = user.role;

  // 📝 Update role in MongoDB
  user.role = newRole.toLowerCase();
  await user.save();

  // 📢 Return updated user and flag if role changed
  if (previousRole !== newRole.toLowerCase()) {
    return { user, roleChanged: true };
  }

  return { user, roleChanged: false };
};
