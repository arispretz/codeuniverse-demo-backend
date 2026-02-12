/**
 * @fileoverview Mongoose model definition for Kanban lists.
 * Represents a Kanban list entity in the database.
 * @module models/KanbanList
 */

import mongoose from 'mongoose';
import { kanbanListSchema } from '../schemas/kanbanListSchema.js';

/**
 * KanbanList model.
 * Provides access to Kanban list documents in MongoDB.
 *
 * @constant
 * @type {mongoose.Model}
 */
export const KanbanList = mongoose.model('KanbanList', kanbanListSchema);
