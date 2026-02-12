/**
 * @fileoverview Mongoose schema definition for user sessions.
 * Represents a user session including start time, last activity, and associated code snippets.
 * @module schemas/sessionSchema
 */

import mongoose from 'mongoose';

/**
 * Session schema.
 * Defines the structure for user sessions in MongoDB.
 *
 * @property {String} userId - The unique identifier of the user (required).
 * @property {Date} startedAt - Timestamp when the session started (default: current date).
 * @property {Date} lastActive - Timestamp of the last activity in the session (default: current date).
 * @property {mongoose.Schema.Types.ObjectId[]} snippets - Array of references to associated snippets.
 */
export const SessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    snippets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Snippet' }],
  }
);
