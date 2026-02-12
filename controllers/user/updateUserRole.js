/**
 * @fileoverview Controller to update a user's role and synchronize it with MongoDB.
 * Ensures that only admins can change roles and prevents self-demotion from admin.
 * Emits a role change event if applicable.
 * @module controllers/user/updateUserRole
 */

import { User } from '../../models/User.js';
import { isAdmin } from '../../middleware/roleMiddleware.js';
import { checkRole } from '../../middleware/checkRole.js';

/**
 * Updates the role of a user and emits a role change event if applicable.
 *
 * @async
 * @function updateUserRole
 * @param {Request} req - Express request object containing user and role data.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with updated user data or error message.
 */
export async function updateUserRole(req, res) {
  const { role } = req.body;
  const { firebaseUid: targetUid } = req.params;
  const requesterUid = req.user.firebaseUid;

  // Ensure requester has admin privileges
  if (!isAdmin(req.user)) {
    return res.status(403).json({ error: 'You do not have permission to change roles' });
  }

  // Prevent self-demotion from admin role
  if (requesterUid === targetUid && role.toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'You cannot remove your own admin role' });
  }

  const normalizedRole = role.toLowerCase();

  // Validate role against allowed roles
  if (!checkRole.includes(normalizedRole)) {
    return res.status(400).json({ error: `Invalid role: ${role}` });
  }

  try {
    /**
     * 🔍 Find the user by Firebase UID.
     */
    const previousUser = await User.findOne({ firebaseUid: targetUid });
    if (!previousUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    /**
     * 📝 Update user role in MongoDB.
     */
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: targetUid },
      { role: normalizedRole },
      { new: true }
    );

    /**
     * 📢 Emit role change event if role was updated.
     */
    if (previousUser.role !== normalizedRole) {
      req.io?.emit('roleChanged', {
        uid: targetUid,
        newRole: normalizedRole,
      });
    }

    res.json({
      message: 'Role updated in MongoDB',
      user: {
        firebaseUid: updatedUser.firebaseUid,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('❌ Error updating role:', error.message);
    res.status(500).json({ error: 'Internal error while updating role' });
  }
}
