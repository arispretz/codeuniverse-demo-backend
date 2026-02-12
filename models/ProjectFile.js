/**
 * @fileoverview Mongoose model definition for project files.
 * Represents a project file entity in the database.
 * @module models/ProjectFile
 */

import mongoose from 'mongoose';
import { projectFileSchema } from '../schemas/projectFileSchema.js';

/**
 * ProjectFile model.
 * Provides access to project file documents in MongoDB.
 * Stores metadata about files associated with user projects.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const ProjectFile = mongoose.model('ProjectFile', projectFileSchema);
