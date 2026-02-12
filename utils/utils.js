/**
 * @fileoverview Utility functions to normalize task status values between frontend and backend.
 * Ensures consistent status mapping for API communication and Kanban board usage.
 * @module utils/utils
 */

/**
 * Converts frontend status values into backend-compatible values.
 *
 * @function backendStatus
 * @param {string} status - Status value from the frontend.
 * @returns {string} Normalized backend status value ('to do', 'in progress', 'review', 'done').
 *
 * @example
 * backendStatus("todo"); // -> "to do"
 * backendStatus("inprogress"); // -> "in progress"
 */
export const backendStatus = (status) => {
  const key = (status || '').toLowerCase().trim();
  switch (key) {
    case 'todo':
    case 'to do':
      return 'to do';
    case 'inprogress':
    case 'in progress':
      return 'in progress';
    case 'review':
      return 'review';
    case 'done':
      return 'done';
    default:
      return 'to do'; // ✅ safe default
  }
};

/**
 * Converts backend status values into frontend-compatible values.
 *
 * @function normalizeStatus
 * @param {string} status - Status value from the backend.
 * @returns {string} Normalized frontend status value ('todo', 'inprogress', 'review', 'done').
 *
 * @example
 * normalizeStatus("to do"); // -> "todo"
 * normalizeStatus("in progress"); // -> "inprogress"
 */
export const normalizeStatus = (status) => {
  const key = (status || '').toLowerCase().trim();
  switch (key) {
    case 'to do':
    case 'todo':
      return 'todo';
    case 'in progress':
    case 'inprogress':
      return 'inprogress';
    case 'review':
      return 'review';
    case 'done':
      return 'done';
    default:
      return 'todo'; // ✅ safe default
  }
};
