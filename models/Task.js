/**
 * @fileoverview Mongoose model definition for task entries.
 * Represents a task entity in the database.
 * @module models/Task
 */

import mongoose from 'mongoose';
import { taskSchema } from '../schemas/taskSchema.js';

/**
 * Task model.
 * Provides access to task documents in MongoDB.
 * Stores metadata about user tasks, including status, deadlines, and ownership.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const Task = mongoose.model('Task', taskSchema);
