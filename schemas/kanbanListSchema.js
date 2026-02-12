/**
 * @fileoverview Mongoose schema definition for Kanban lists.
 * Represents a Kanban list entity within a project, including metadata such as name, due date, and creator.
 * @module schemas/kanbanListSchema
 */

import mongoose from 'mongoose';

/**
 * KanbanList schema.
 * Defines the structure for Kanban lists in MongoDB.
 *
 * @property {String} name - The name of the Kanban list (required).
 * @property {Date} dueDate - Optional due date for the list.
 * @property {mongoose.Schema.Types.ObjectId} projectId - Reference to the associated project (required).
 * @property {mongoose.Schema.Types.ObjectId} createdBy - Reference to the user who created the list (required).
 * @property {Date} createdAt - Timestamp when the list was created (auto-generated).
 * @property {Date} updatedAt - Timestamp when the list was last updated (auto-generated).
 */
export const kanbanListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dueDate: { type: Date },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdByFirebase: { type: String }, // opcional
    tasks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
      default: [],
    },
  },
  { timestamps: true }
);

kanbanListSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id?.toString();
    ret.projectId = ret.projectId?.toString();
    ret.createdBy = ret.createdBy?.toString();
    ret.tasks = (ret.tasks || []).map((t) => t?.toString());
    return ret;
  },
});


