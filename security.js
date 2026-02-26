/**
 * @fileoverview Express security middleware setup including Helmet, CORS, rate limiting, Firebase authentication, and audit logging.
 * Provides centralized security configuration for the backend application.
 * @module security
 */

import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { admin } from './config/firebase.js';
import { auth } from './middleware/authMiddleware.js';

/**
 * Middleware to authenticate users using Firebase ID tokens.
 *
 * @async
 * @function firebaseAuthMiddleware
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export async function firebaseAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split('Bearer ')[1]
      : null;

    if (!token) {
      console.warn('No token provided');
      return res.status(401).json({ error: 'Token not provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.error('Firebase authentication error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Rate limiter for login attempts.
 */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: '⚠️ Too many login attempts, please wait a minute before retrying.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for authentication requests.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: '⚠️ Too many authentication requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware to audit unauthorized access attempts.
 *
 * @function auditMiddleware
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
function auditMiddleware(req, res, next) {
  res.on('finish', () => {
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.warn({
        event: 'unauthorized_access',
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        time: new Date().toISOString(),
      });
    }
  });
  next();
}

/**
 * Applies security-related middleware to the Express app.
 *
 * @function securityMiddleware
 * @param {Express} app - Express application instance.
 */
export function securityMiddleware(app) {
  try {
    // Helmet with extended CSP
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://apis.google.com', 'https://cdn.jsdelivr.net'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', process.env.CDN_URL || ''],
            connectSrc: [
              "'self'",
              process.env.BACKEND_URL || '',
              process.env.ASSISTANT_URL || '',
              process.env.FRONTEND_URL || '',
              "blob:",
              "data:",
            ],
            frameSrc: ["'self'", 'https://meet.jit.si'],
          },
        },
      })
    );

    // Global rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: 'Too many requests from this IP, please try again later.',
    });
    app.use(limiter);

    // Validate required environment variables
    if (!process.env.FRONTEND_URL) {
      throw new Error("❌ FRONTEND_URL environment variable is not defined. Please set it in your .env file.");
    }

    // Unified CORS
    const isDev = process.env.NODE_ENV !== 'production';
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      process.env.ASSISTANT_URL,
    ].filter(Boolean);

    app.use(cors({
      origin: (origin, callback) => {
        if (isDev || !origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.warn(`🚫 CORS blocked for origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Audit middleware
    app.use(auditMiddleware);

    // Disable x-powered-by header
    app.disable('x-powered-by');

    // Protected routes and specific rate limits
    app.use('/api/auth/login', loginLimiter);
    app.use('/api/auth', authLimiter);
    app.use('/api/protected', firebaseAuthMiddleware, auth);
  } catch (err) {
    console.error('❌ Error initializing security middleware:', err.message);
  }
}
