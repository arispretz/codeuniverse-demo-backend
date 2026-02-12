/**
 * @fileoverview Mongoose schema definition for User Profiles.
 * Represents user preferences such as language, coding style, notes, and last usage.
 * @module schemas/userProfileSchema
 */

import mongoose from 'mongoose';

/**
 * UserProfile schema.
 * Defines the structure for user profiles in MongoDB.
 *
 * @property {String} user_id - Unique identifier of the user (required).
 * @property {String} preferred_language - Preferred programming language (default: "python").
 * @property {String} preferred_style - Preferred coding style (default: "functional").
 * @property {String[]} style_notes - Array of notes or comments about the user's style.
 * @property {Date} last_used - Timestamp of the last time the profile was used.
 */
export const userProfileSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    preferred_language: { type: String, default: "python" },
    preferred_style: { type: String, default: "functional" },
    style_notes: { type: [String], default: [] },
    last_used: { type: Date },
  }
);
