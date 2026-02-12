/**
 * @fileoverview Controller for task management (local, kanban, personal).
 * Provides endpoints to create, retrieve, update, and delete tasks in different contexts.
 * @module controllers/taskController
 */

import { Task } from '../models/Task.js';
import { backendStatus, normalizeStatus } from '../utils/utils.js';

/* ------------------------- LOCAL TASKS ------------------------- */

/**
 * Creates a local task.
 *
 * @async
 * @function createLocalTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const createLocalTask = async (req, res) => {
  try {
    const { projectId, title, description, status, deadline, assignedTo } = req.body;
    const listId = req.body.listId || req.params.listId;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!listId) {
      return res.status(400).json({ error: "listId is required" });
    }

    let assignedUser = null;
    if (assignedTo) {
      assignedUser = {
        _id: assignedTo._id || assignedTo,
        uid: assignedTo.uid || req.user?.uid,
      };
    }

    const backendStatusValue = backendStatus(status || "to do");

    const task = await Task.create({
      projectId,
      listId,
      title: title.trim(),
      description,
      status: backendStatusValue,
      deadline: deadline ? new Date(deadline) : null,
      source: "local",
      createdBy: req.user._id,
      assignedTo: assignedUser,
      history: [
        { changedBy: req.user._id, change: "Local task created", changedAt: new Date() },
      ],
    });

    res.status(201).json({ ...task.toObject(), status: normalizeStatus(task.status) });
  } catch (error) {
    console.error("❌ Error creating local task:", error);
    res.status(500).json({ error: "Error creating local task", details: error.message });
  }
};

/**
 * Retrieves local tasks.
 *
 * @async
 * @function getLocalTasks
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const getLocalTasks = async (req, res) => {
  try {
    const { projectId, assignedTo } = req.query;

    const filter = { source: 'local' };
    if (projectId) filter.projectId = projectId;
    if (assignedTo) {
      filter.$or = [
        { 'assignedTo._id': assignedTo },
        { 'assignedTo.uid': assignedTo }
      ];
    }

    const tasks = await Task.find(filter)
      .populate('createdBy', 'username email')
      .lean();

    const normalized = tasks.map(t => ({ ...t, status: normalizeStatus(t.status) }));
    res.json(normalized);
  } catch (error) {
    console.error("❌ Error retrieving local tasks:", error);
    res.status(500).json({ error: 'Error retrieving local tasks', details: error.message });
  }
};

/**
 * Updates a local task.
 *
 * @async
 * @function updateLocalTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const updateLocalTask = async (req, res) => {
  try {
    const form = { ...req.body };

    if (form.status) {
      form.status = backendStatus(form.status);
    }

    if (form.assignedTo) {
      form.assignedTo = {
        _id: form.assignedTo._id || form.assignedTo,
        uid: form.assignedTo.uid || req.user?.uid,
      };
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, source: "local", createdBy: req.user._id },
      { $set: { ...form, syncedAt: new Date() } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Local task not found" });
    }

    res.json({ ...updated.toObject(), status: normalizeStatus(updated.status) });
  } catch (error) {
    console.error("❌ Error updating local task:", error);
    res.status(500).json({ error: "Error updating local task", details: error.message });
  }
};

/**
 * Deletes a local task.
 *
 * @async
 * @function deleteLocalTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const deleteLocalTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      source: 'local',
      createdBy: req.user._id,
    });
    if (!deleted) return res.status(404).json({ error: 'Local task not found' });
    res.json({ message: 'Local task deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting local task:", error);
    res.status(500).json({ error: 'Error deleting local task', details: error.message });
  }
};

/* ------------------------- KANBAN TASKS ------------------------- */

/**
 * Creates a kanban task.
 *
 * @async
 * @function createKanbanTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const createKanbanTask = async (req, res) => {
  try {
    const { projectId, title, description, status, deadline, assignees, priority, tags } = req.body;
    const listId = req.params.listId;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!listId) {
      return res.status(400).json({ error: "listId is required for kanban tasks" });
    }

    const backendStatusValue = backendStatus(status || "to do");

    const task = await Task.create({
      projectId,
      listId,
      title: title.trim(),
      description,
      status: backendStatusValue,
      deadline: deadline ? new Date(deadline) : null,
      assignees: assignees || [],
      priority: priority || "medium",
      tags: tags || [],
      source: "kanban",
      createdBy: req.user._id,
      history: [
        {
          changedBy: req.user._id,
          change: "Kanban task created",
          changedAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      ...task.toObject(),
      status: normalizeStatus(task.status),
    });
  } catch (error) {
    console.error("❌ Error creating kanban task:", error);
    res.status(500).json({ error: "Error creating kanban task", details: error.message });
  }
};

/**
 * Retrieves kanban tasks.
 *
 * @async
 * @function getKanbanTasks
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const getKanbanTasks = async (req, res) => {
  try {
    const filter = { source: "kanban" };

    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }

    if (req.query.assignedOnly === "true") {
      filter.assignees = { $elemMatch: { _id: req.user._id } };
    }

    const tasks = await Task.find(filter).lean();
    const normalized = tasks.map((t) => ({ ...t, status: normalizeStatus(t.status) }));
    res.json(normalized);
  } catch (err) {
    console.error("❌ Error retrieving kanban tasks:", err);
    res.status(500).json({ error: "KANBAN_TASKS_FETCH_FAILED", details: err.message });
  }
};

/**
 * Retrieves kanban columns grouped by status.
 *
 * @async
 * @function getKanbanColumns
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const getKanbanColumns = async (req, res) => {
  try {
    const filter = { source: "kanban" };
    if (req.query.listId) filter.listId = req.query.listId;
    if (req.query.projectId) filter.projectId = req.query.projectId;

    const tasks = await Task.find(filter).lean();

    const grouped = tasks.reduce(
      (acc, task) => {
        const status = normalizeStatus(task.status || "to do");
        (acc[status] ||= []).push({ ...task, status });
        return acc;
      },
      { todo: [], inprogress: [], review: [], done: [] }
    );

    res.json(grouped);
  } catch (error) {
    console.error("❌ Error retrieving kanban columns:", error);
    res.status(500).json({ error: "Error retrieving kanban columns", details: error.message });
  }
};

/**
 * Updates a kanban task.
 *
 * @async
 * @function updateKanbanTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const updateKanbanTask = async (req, res) => {
  try {
    const form = { ...req.body };
    if (form.status) form.status = backendStatus(form.status);

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, source: "kanban" },
      { $set: { ...form, syncedAt: new Date() } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Kanban task not found" });
    res.json({ ...updated.toObject(), status: normalizeStatus(updated.status) });
  } catch (error) {
    console.error("❌ Error updating kanban task:", error);
    res.status(500).json({ error: "Error updating kanban task", details: error.message });
  }
};

/**
 * Moves a kanban task to a new status.
 *
 * @async
 * @function moveKanbanTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const moveKanbanTask = async (req, res) => {
  try {
    const { status } = req.body;
    const backendStatusValue = backendStatus(status);

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, source: "kanban" },
      { $set: { status: backendStatusValue, movedAt: new Date() } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Kanban task not found" });
    res.json({ ...updated.toObject(), status: normalizeStatus(updated.status) });
  } catch (error) {
    console.error("❌ Error moving kanban task:", error);
    res.status(500).json({ error: "Error moving kanban task", details: error.message });
  }
};

/**
 * Deletes a kanban task.
 *
 * @async
 * @function deleteKanbanTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const deleteKanbanTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, source: "kanban" });
    if (!deleted) return res.status(404).json({ error: "Kanban task not found" });
    res.json({ message: "Kanban task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting kanban task:", error);
    res.status(500).json({ error: "Error deleting kanban task", details: error.message });
  }
};

/**
 * Adds a comment to a kanban task.
 *
 * @async
 * @function addKanbanComment
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const addKanbanComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const task = await Task.findOne({ _id: req.params.id, source: "kanban" });
    if (!task) return res.status(404).json({ error: "Kanban task not found" });

    const comment = {
      text: text.trim(),
      author: req.user._id,
      createdAt: new Date(),
    };

    if (!Array.isArray(task.comments)) {
      task.comments = [];
    }

    task.comments.push(comment);
    await task.save();

    res.status(201).json({
      ...comment,
      status: normalizeStatus(task.status),
    });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ error: "Error adding comment", details: error.message });
  }
};

/* ------------------------- PERSONAL TASKS ------------------------- */

/**
 * Creates a personal task.
 *
 * @async
 * @function createPersonalTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const createPersonalTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required for personal tasks' });
    }

    const backendStatusValue = backendStatus(status || 'to do');

    const task = await Task.create({
      title: title.trim(),
      description,
      source: 'personal',
      createdBy: req.user._id,
      createdByFirebase: req.user.uid,
      status: backendStatusValue,
    });

    res.status(201).json({ ...task.toObject(), status: normalizeStatus(task.status) });
  } catch (error) {
    console.error("❌ Error creating personal task:", error);
    res.status(500).json({ error: 'Error creating personal task', details: error.message });
  }
};

/**
 * Retrieves personal tasks for the authenticated user.
 *
 * @async
 * @function getPersonalTasks
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const getPersonalTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ source: 'personal', createdBy: req.user._id }).lean();
    const normalized = tasks.map(t => ({ ...t, status: normalizeStatus(t.status) }));
    res.json(normalized);
  } catch (error) {
    console.error("❌ Error retrieving personal tasks:", error);
    res.status(500).json({ error: 'Error retrieving personal tasks', details: error.message });
  }
};

/**
 * Retrieves a personal task by ID.
 *
 * @async
 * @function getPersonalTaskById
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const getPersonalTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      source: 'personal',
      createdBy: req.user._id,
    }).lean();

    if (!task) {
      return res.status(404).json({ error: 'Personal task not found' });
    }

    res.json({ ...task, status: normalizeStatus(task.status) });
  } catch (error) {
    console.error("❌ Error retrieving personal task detail:", error);
    res.status(500).json({ error: 'Error retrieving personal task detail', details: error.message });
  }
};

/**
 * Updates a personal task.
 *
 * @async
 * @function updatePersonalTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const updatePersonalTask = async (req, res) => {
  try {
    const form = { ...req.body };

    if (form.status) {
      form.status = backendStatus(form.status);
    }

    if (form.title && !form.title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, source: 'personal', createdBy: req.user._id },
      { $set: { ...form, syncedAt: new Date() } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Personal task not found' });
    }

    res.json({ ...updated.toObject(), status: normalizeStatus(updated.status) });
  } catch (error) {
    console.error("❌ Error updating personal task:", error);
    res.status(500).json({ error: 'Error updating personal task', details: error.message });
  }
};

/**
 * Deletes a personal task.
 *
 * @async
 * @function deletePersonalTask
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const deletePersonalTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      source: 'personal',
      createdBy: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Personal task not found' });
    }

    res.json({ message: 'Personal task deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting personal task:", error);
    res.status(500).json({ error: 'Error deleting personal task', details: error.message });
  }
};

/* ------------------------- UTILITY ------------------------- */

/**
 * Retrieves tasks by listId (local or kanban).
 *
 * @async
 * @function getTasksByListId
 * @param {Request} req - Express request object containing UID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success message or error message.
 */
export const getTasksByListId = async (req, res) => {
  try {
    const { listId } = req.params;
    const tasks = await Task.find({ listId }).lean();
    const normalized = tasks.map((t) => ({ ...t, status: normalizeStatus(t.status) }));
    res.json(normalized);
  } catch (error) {
    console.error("❌ Error retrieving tasks by listId:", error);
    res.status(500).json({ error: 'Error retrieving tasks by listId', details: error.message });
  }
};

