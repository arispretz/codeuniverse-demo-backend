/**
 * @fileoverview Controller for project file operations.
 * Provides endpoints to create, retrieve, update, and delete project files and folders.
 * Includes support for building a hierarchical file tree.
 * @module controllers/projectFilesController
 */

import { ProjectFile } from '../models/ProjectFile.js';
import { buildTree } from '../utils/buildTree.js';

/**
 * Retrieves the file tree of a project.
 *
 * @async
 * @function getProjectTree
 * @param {Request} req - Express request object containing projectId in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with project file tree or error message.
 */
export const getProjectTree = async (req, res) => {
  try {
    const { projectId } = req.params;
    const files = await ProjectFile.find({ projectId }).lean();
    const tree = buildTree(files);
    res.json(tree);
  } catch (error) {
    console.error('❌ Error retrieving project file tree:', error);
    res.status(500).json({ error: 'Error retrieving project file tree' });
  }
};

/**
 * Creates a new project file or folder.
 *
 * @async
 * @function createProjectFile
 * @param {Request} req - Express request object containing file data in body.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with created file or error message.
 */
export const createProjectFile = async (req, res) => {
  try {
    const file = new ProjectFile(req.body);
    await file.save();
    res.status(201).json(file);
  } catch (error) {
    console.error('❌ Error creating file/folder:', error);
    res.status(400).json({ error: 'Error creating file/folder' });
  }
};

/**
 * Retrieves a project file by ID.
 *
 * @async
 * @function getProjectFileById
 * @param {Request} req - Express request object containing file ID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with file or error message.
 */
export const getProjectFileById = async (req, res) => {
  try {
    const file = await ProjectFile.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
      res.json(file);
  } catch (error) {
    console.error('❌ Error retrieving file:', error);
    res.status(404).json({ error: 'File not found' });
  }
};

/**
 * Updates a project file or folder.
 *
 * @async
 * @function updateProjectFile
 * @param {Request} req - Express request object containing file ID in params and update data in body.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with updated file or error message.
 */
export const updateProjectFile = async (req, res) => {
  try {
    const updated = await ProjectFile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'File not found' });
      res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'A node with that name already exists in this folder' });
    }
    res.status(400).json({ error: 'Error updating file/folder' });
  }
};

/**
 * Deletes a project file or folder.
 *
 * @async
 * @function deleteProjectFile
 * @param {Request} req - Express request object containing file ID in params.
 * @param {Response} res - Express response object used to send results.
 * @returns {Promise<void>} Sends JSON response with success confirmation or error message.
 */
export const deleteProjectFile = async (req, res) => {
  try {
    const deleted = await ProjectFile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'File not found' });
      res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting file/folder:', error);
    res.status(400).json({ error: 'Error deleting file/folder' });
  }
};
