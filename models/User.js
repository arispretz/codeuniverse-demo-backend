/**
 * @fileoverview Mongoose model definition for user accounts.
 * Represents a user entity in the database.
 * @module models/User
 */

import mongoose from 'mongoose';
import { userSchema } from '../schemas/userSchema.js';

/**
 * User model.
 * Provides access to user documents in MongoDB.
 * Stores authentication data, roles, and profile metadata.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const User = mongoose.model('User', userSchema);
