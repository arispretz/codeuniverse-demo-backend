/**
 * @fileoverview Middleware to validate request origin against a list of allowed origins.
 * Blocks requests from unauthorized origins based on environment configuration.
 * @module middleware/validateOrigin
 */

const allowedOrigins = [
  process.env.BACKEND_URL,
  process.env.FRONTEND_URL, 
];

/**
 * Middleware that blocks requests from unauthorized origins.
 * Checks the `Origin` or `Referer` header against a whitelist.
 * Responds with 403 if origin is invalid, and 500 if unexpected error occurs.
 *
 * @function validateOrigin
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export function validateOrigin(req, res, next) {
  try {
    const origin = req.headers.origin || req.headers.referer || '';
    const isAllowed = origin && allowedOrigins.some(allowed => allowed && origin.startsWith(allowed));

    if (!isAllowed) {
      console.warn(`🚫 Blocked: unauthorized origin → ${origin}`);
      return res.status(403).json({ error: 'Unauthorized origin' });
    }

    next();
  } catch (err) {
    console.error('❌ Error in validateOrigin middleware:', err);
    res.status(500).json({ error: 'Internal server error in origin validation' });
  }
}
