/**
 * @fileoverview Validates required environment variables and exports configuration constants.
 * Ensures that critical environment variables are defined before the application starts.
 * If any required variable is missing, the process will exit with an error.
 * @module config/envConfig
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * 🔍 List of required environment variables for running the application.
 * @type {string[]}
 */
const requiredEnvVars = ['PORT', 'FIREBASE_CREDENTIAL_JSON', 'BACKEND_URL', 'MONGO_URI'];

/**
 * ✅ Environment variable validation.
 * If any variable is missing, the error is logged and the process exits.
 */
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Environment variable missing: ${key}`);
    process.exit(1);
  }
});

/**
 * 🌐 Server port.
 * Defaults to 4000 if not specified.
 * @type {number}
 */
export const PORT = parseInt(process.env.PORT, 10) || 4000;

/**
 * 🌍 Allowed origins for CORS configuration.
 * Includes backend and frontend URLs defined in the environment.
 * @type {string[]}
 */
export const allowedOrigins = [
  process.env.BACKEND_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173',   // Vite dev server
  'http://127.0.0.1:5173',   // Loopback alternative
  'http://localhost',        // Nginx serving on port 80
  'http://172.29.207.231:5173',
  'https://arispretz-codeuniverse-onrender.com',
].filter(Boolean);
