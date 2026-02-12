/**
 * @file Utility to assign user roles based on email and invitation code.
 * @module utils/roleUtils
 */

/**
 * Assigns a role to a user based on their email and invitation code.
 *
 * @function assignRole
 * @param {string} email - User's email address.
 * @param {string} [invitationCode] - Optional invitation code.
 * @returns {string} Assigned role: 'dev', 'admin', or 'viewer'.
 * @throws {Error} If email is missing or invalid.
 */
export function assignRole(email, invitationCode) {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid or missing email');
  }

  if (invitationCode) return 'dev';
  if (email.endsWith('@yourcompany.com')) return 'admin';
  return 'viewer';
}
