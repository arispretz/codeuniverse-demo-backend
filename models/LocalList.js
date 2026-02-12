/**
 * @fileoverview Mongoose model definition for Local lists.
 * Represents a Local list entity in the database.
 * @module models/LocalList
 */

import mongoose from 'mongoose';
import { localListSchema } from '../schemas/localListSchema.js';

/**
 * LocalList model.
 * Provides access to Local list documents in MongoDB.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const LocalList = mongoose.model('LocalList', localListSchema);
