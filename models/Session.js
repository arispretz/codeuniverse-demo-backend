/**
 * @fileoverview Mongoose model definition for user sessions.
 * Represents a session entity in the database.
 * @module models/Session
 */

import mongoose from 'mongoose';
import { SessionSchema } from '../schemas/sessionSchema.js';

/**
 * Session model.
 * Provides access to user session documents in MongoDB.
 * Stores metadata about active sessions, including user references and expiration details.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const Session = mongoose.model('Session', SessionSchema);
