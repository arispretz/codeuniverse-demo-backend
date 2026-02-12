import { User } from '../models/User.js';

const validRoles = ['admin', 'manager', 'developer', 'guest', 'ai_assistant'];

const assignRole = async (user, role) => {
  user.role = role;
  await user.save();
  return user;
};

/**
 * Handles PATCH /api/users/:firebaseUid/role.
 * Assigns a role to a MongoDB user.
 */
export const updateUserRole = async (req, res) => {
  try {
    const callerRole = req.user?.role;
    if (callerRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can change roles' });
    }

    const { firebaseUid } = req.params;
    const { role } = req.body;

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await assignRole(user, role);
    res.json({ message: `Role ${role} assigned to user ${firebaseUid}`, user: updatedUser });
  } catch (error) {
    console.error('❌ Error assigning role:', error);
    res.status(500).json({ error: 'Internal error while assigning role' });
  }
};
