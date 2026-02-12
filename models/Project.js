/**
 * @fileoverview Mongoose model definition for project entries.
 * Represents a project entity in the database.
 * @module models/Project
 */

import mongoose from 'mongoose';
import { projectSchema } from '../schemas/projectSchema.js';

/**
 * Project model.
 * Provides access to project documents in MongoDB.
 * Stores metadata about user-created projects, including title, description, and timestamps.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const Project = mongoose.model('Project', projectSchema);
