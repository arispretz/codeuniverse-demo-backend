/**
 * @fileoverview Express routes for project file management.
 * Defines endpoints for handling project file operations such as creation, retrieval, update, and deletion.
 * @module routes/projectFilesRoutes
 */

import express from 'express';
import {
  getProjectTree,
  createProjectFile,
  getProjectFileById,
  updateProjectFile,
  deleteProjectFile
} from '../controllers/projectFilesController.js';

export const projectFilesRouter = express.Router();

/**
 * GET /:projectId/tree
 * Retrieves the project file tree structure for a given project.
 */
projectFilesRouter.get('/:projectId/tree', getProjectTree);

/**
 * POST /
 * Creates a new project file or folder.
 */
projectFilesRouter.post('/', createProjectFile);

/**
 * GET /:id
 * Retrieves the content of a project file by its ID.
 */
projectFilesRouter.get('/:id', getProjectFileById);

/**
 * PUT /:id
 * Updates (rename or move) a project file or folder by its ID.
 */
projectFilesRouter.put('/:id', updateProjectFile);

/**
 * DELETE /:id
 * Deletes a project file or folder by its ID.
 */
projectFilesRouter.delete('/:id', deleteProjectFile);
