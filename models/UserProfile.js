/**
 * @fileoverview Mongoose model definition for user profiles.
 * Represents a user profile entity in the database.
 * @module models/UserProfile
 */

import mongoose from 'mongoose';
import { userProfileSchema } from '../schemas/userProfileSchema.js';

/**
 * UserProfile model.
 * Provides access to user profile documents in MongoDB.
 * Stores metadata about user details, preferences, and associated information.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
