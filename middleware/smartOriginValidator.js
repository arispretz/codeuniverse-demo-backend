/**
 * @fileoverview Middleware to validate request origin for sensitive routes and methods.
 * Blocks requests to sensitive endpoints if the origin is not trusted.
 * @module middleware/smartOriginValidator
 */

const allowedOrigins = [
  process.env.BACKEND_URL,
  process.env.FRONTEND_URL,
];

const riskyMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
const sensitivePaths = ['/admin', '/users', '/audit', '/stats'];

/**
 * Middleware that blocks requests to sensitive routes/methods if the origin is not trusted.
 * Responds with 403 if origin is invalid, and 500 if unexpected error occurs.
 *
 * @function smartOriginValidator
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.

 */
export function smartOriginValidator(req, res, next) {
  try {
    const origin = req.headers.origin || req.headers.referer || '';
    const method = req.method;
    const path = req.path;

    const isSensitiveMethod = riskyMethods.includes(method);
    const isSensitivePath = sensitivePaths.some(segment => path.includes(segment));

    if (isSensitiveMethod && isSensitivePath) {
      const isLocal =
        req.hostname === process.env.LOCAL_HOSTNAME || 
        req.ip === process.env.LOCAL_IP;             

      const isAllowed =
        isLocal ||
        allowedOrigins.some(allowed => allowed && origin.startsWith(allowed));

      if (!isAllowed) {
        console.warn(`🚫 Blocked: unauthorized origin → ${origin}`);
        return res.status(403).json({ error: 'Unauthorized origin' });
      }
    }

    next();
  } catch (err) {
    console.error('❌ Error in smartOriginValidator middleware:', err);
    res.status(500).json({ error: 'Internal server error in origin validation' });
  }
}
