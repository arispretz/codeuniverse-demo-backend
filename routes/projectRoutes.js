/**
 * @fileoverview Express routes for project and task management.
 * Defines endpoints for handling projects, local lists, tasks, and Kanban boards.
 * @module routes/projectRoutes
 */

import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectsWithTasks,
  createFullProject,
  getProjectsFull,
  getProjectFullById,
  createLocalList,
  getLocalLists,
  createKanbanList,
  getKanbanLists,
  getKanbanColumns,
  createTaskInList,
  updateTaskInList,
  deleteTaskInList
} from '../controllers/projectController.js';

export const projectRouter = express.Router();

/**
 * POST /projects
 * Creates a new project.
 */
projectRouter.post('/projects', auth, createProject);

/**
 * GET /projects
 * Retrieves all projects for the authenticated user.
 */
projectRouter.get('/projects', auth, getProjects);

/**
 * GET /projects/:id
 * Retrieves a project by its ID.
 */
projectRouter.get('/projects/:id', auth, getProjectById);

/**
 * GET /projects/with-tasks
 * Retrieves all projects including their associated tasks.
 */
projectRouter.get('/projects/with-tasks', auth, getProjectsWithTasks);

/**
 * POST /projects/full
 * Creates a new project with full details (including lists and tasks).
 */
projectRouter.post('/projects/full', auth, createFullProject);

/**
 * GET /projects/full
 * Retrieves all projects with full details.
 */
projectRouter.get('/projects/full', auth, getProjectsFull);

/**
 * GET /projects/:id/full
 * Retrieves a project with full details by its ID.
 */
projectRouter.get('/projects/:id/full', auth, getProjectFullById);

/**
 * POST /lists
 * Creates a new local list.
 */
projectRouter.post('/lists', auth, createLocalList);

/**
 * GET /lists
 * Retrieves all local lists.
 */
projectRouter.get('/lists', auth, getLocalLists);

/**
 * POST /lists/:listId/tasks
 * Creates a new task inside a specific local list.
 */
projectRouter.post('/lists/:listId/tasks', auth, createTaskInList);

/**
 * PUT /lists/:listId/tasks/:taskId
 * Updates a task inside a specific local list.
 */
projectRouter.put('/lists/:listId/tasks/:taskId', auth, updateTaskInList);

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Deletes a task from a specific local list.
 */
projectRouter.delete('/lists/:listId/tasks/:taskId', auth, deleteTaskInList);

/**
 * POST /kanban/lists
 * Creates a new Kanban list.
 */
projectRouter.post('/kanban/lists', auth, createKanbanList);

/**
 * GET /kanban/lists
 * Retrieves all Kanban lists.
 */
projectRouter.get('/kanban/lists', auth, getKanbanLists);

/**
 * GET /kanban/columns
 * Retrieves all Kanban columns.
 */
projectRouter.get('/kanban/columns', auth, getKanbanColumns);
