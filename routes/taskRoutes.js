/**
 * @fileoverview Express routes for task management (local, kanban, personal).
 * Defines endpoints for handling tasks across different contexts: local lists, kanban boards, and personal tasks.
 * @module routes/taskRoutes
 */

import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import {
  createLocalTask,
  getLocalTasks,
  updateLocalTask,
  deleteLocalTask,
  getKanbanTasks,
  createKanbanTask,
  updateKanbanTask,
  moveKanbanTask,
  deleteKanbanTask,
  addKanbanComment,
  getPersonalTasks,
  createPersonalTask,
  updatePersonalTask,
  deletePersonalTask,
  getPersonalTaskById,
  getTasksByListId
} from '../controllers/taskController.js';

export const taskRouter = express.Router();

/**
 * Local tasks routes
 */
taskRouter.post('/tasks/local', auth, createLocalTask);       // Create a local task
taskRouter.get('/tasks/local', auth, getLocalTasks);          // Retrieve all local tasks
taskRouter.put('/tasks/local/:id', auth, updateLocalTask);    // Update a local task by ID
taskRouter.delete('/tasks/local/:id', auth, deleteLocalTask); // Delete a local task by ID

/**
 * Kanban tasks routes
 */
taskRouter.get('/tasks/kanban', auth, getKanbanTasks);                 // Retrieve all kanban tasks
taskRouter.post('/tasks/kanban/:listId', auth, createKanbanTask);      // Create a kanban task in a specific list
taskRouter.put('/tasks/kanban/:id', auth, updateKanbanTask);           // Update a kanban task by ID
taskRouter.patch('/tasks/kanban/:id/move', auth, moveKanbanTask);      // Move a kanban task to another list/column
taskRouter.delete('/tasks/kanban/:id', auth, deleteKanbanTask);        // Delete a kanban task by ID
taskRouter.post('/tasks/kanban/:id/comments', auth, addKanbanComment); // Add a comment to a kanban task

/**
 * Personal tasks routes
 */
taskRouter.get('/tasks/personal', auth, getPersonalTasks);             // Retrieve all personal tasks
taskRouter.post('/tasks/personal', auth, createPersonalTask);          // Create a personal task
taskRouter.put('/tasks/personal/:id', auth, updatePersonalTask);       // Update a personal task by ID
taskRouter.delete('/tasks/personal/:id', auth, deletePersonalTask);    // Delete a personal task by ID
taskRouter.get('/tasks/personal/:id', auth, getPersonalTaskById);      // Retrieve a personal task by ID

/**
 * Tasks by list routes
 */
taskRouter.get('/lists/:listId/tasks', auth, getTasksByListId);        // Retrieve tasks by list ID
