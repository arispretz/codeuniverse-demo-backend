/**
 * @fileoverview Mongoose schema definition for Project files.
 * Represents files and folders within a project, including hierarchy and content.
 * @module schemas/projectFileSchema
 */

import mongoose from 'mongoose';

/**
 * ProjectFile schema.
 * Defines the structure for project files and folders in MongoDB.
 *
 * @property {mongoose.Schema.Types.ObjectId} projectId - Reference to the associated project (required, indexed).
 * @property {String} name - The name of the file or folder (required).
 * @property {String} type - Type of the entity, either 'file' or 'folder' (required).
 * @property {mongoose.Schema.Types.ObjectId|null} parentId - Reference to the parent folder (nullable).
 * @property {String} content - File content (default empty string).
 * @property {Date} createdAt - Timestamp when the file was created (auto-generated).
 * @property {Date} updatedAt - Timestamp when the file was last updated (auto-generated).
 */
export const projectFileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['file', 'folder'],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectFile',
      default: null,
    },
    content: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index to ensure unique file/folder names within the same project and parent folder
projectFileSchema.index({ projectId: 1, parentId: 1, name: 1 }, { unique: true });
