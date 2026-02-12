/**
 * @fileoverview Global and 404 error handling middlewares for Express.
 * Provides standardized error responses and logging for unexpected errors and unmatched routes.
 * @module middleware/errorHandlers
 */

/**
 * Global error handler middleware.
 * Logs the error and sends a standardized JSON response.
 * Handles unexpected error shapes gracefully.
 *
 * @function globalErrorHandler
 * @param {Error} err - The error object.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export function globalErrorHandler(err, req, res, next) {
  try {
    const status = err?.status || 500;
    const message = err?.message || 'Unexpected error';
    const stack = err?.stack || 'No stack trace';

    console.error('🔥 Error caught by middleware:', {
      message,
      stack,
      status,
    });

    res.status(status).json({
      error: 'Internal Server Error',
      message,
    });
  } catch (internalErr) {
    console.error('💥 Failed inside globalErrorHandler:', internalErr);
    res.status(500).json({
      error: 'Critical failure in error handler',
      message: internalErr.message,
    });
  }
}

/**
 * 404 handler middleware.
 * Sends a JSON response when no route matches.
 *
 * @function notFoundHandler
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export function notFoundHandler(req, res) {
  try {
    res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('💥 Failed inside notFoundHandler:', err);
    res.status(500).json({ error: 'Failed to handle 404 error' });
  }
}
