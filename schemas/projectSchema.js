/**
 * @fileoverview Mongoose schema definition for Projects.
 * Represents a project entity including metadata such as name, description, owner, members, repository URL, progress, lists, and tasks.
 * @module schemas/projectSchema
 */

import mongoose from "mongoose";

export const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdByFirebase: { type: String }, // opcional, para integración con Firebase UID
    repoUrl: { type: String },

    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    progress: { type: Number, default: 0 },

    localLists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "LocalList" }],
      default: [],
    },
    kanbanLists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "KanbanList" }],
      default: [],
    },

    tasks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
      default: [],
    },
  },
  { timestamps: true }
);

/**
 * JSON transformation.
 * Converts ObjectIds to strings when returning JSON responses.
 */
projectSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id?.toString();
    ret.ownerId = ret.ownerId?.toString();
    ret.members = (ret.members || []).map((m) => m?.toString());
    ret.localLists = (ret.localLists || []).map((l) => l?.toString());
    ret.kanbanLists = (ret.kanbanLists || []).map((k) => k?.toString());
    ret.tasks = (ret.tasks || []).map((t) => t?.toString());
    return ret;
  },
});
