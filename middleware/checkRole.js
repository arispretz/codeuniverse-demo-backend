/**
 * @fileoverview Middleware to authorize users based on their role.
 * Ensures that only users with specific roles can access certain routes.
 * @module middleware/checkRole
 */

/**
 * Middleware factory that checks if the authenticated user has one of the allowed roles.
 * Responds with 401 if unauthenticated, 403 if unauthorized, and 500 if unexpected errors occur.
 *
 * @function checkRole
 * @param {string[]} allowedRoles - Array of roles that are permitted to access the route.
 * @returns {Function} Express middleware function.
 */
export function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const { user } = req;

      // ✅ Ensure user is authenticated
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // ✅ Ensure user has one of the allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        });
      }

      // ✅ Proceed if authorized
      next();
    } catch (err) {
      console.error('❌ Error in checkRole middleware:', err);
      res.status(500).json({ error: 'Internal server error in role check' });
    }
  };
}
