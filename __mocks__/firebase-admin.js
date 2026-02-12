/**
 * @fileoverview Jest mock for Firebase Admin SDK.
 * Provides mocked implementations of Firebase Admin methods
 * to allow testing without real Firebase credentials or connections.
 * @module __mocks__/firebase-admin
 */

/**
 * Mocked authentication object.
 * Simulates Firebase Auth service with a getUser method.
 * @type {{ getUser: jest.Mock }}
 */
const mockAuth = {
  getUser: jest.fn().mockResolvedValue({
    uid: "test-uid",
    email: "test@example.com",
    role: "ADMIN", // Default role for testing
  }),
};

/**
 * Mocked credential object.
 * Simulates Firebase credential creation.
 * @type {{ cert: jest.Mock }}
 */
const mockCredential = {
  cert: jest.fn().mockReturnValue("mock-cert"),
};

/**
 * Mocked initializeApp function.
 * Simulates Firebase app initialization.
 * @type {jest.Mock}
 */
const mockInitializeApp = jest.fn();

/**
 * Exported mock module for firebase-admin.
 * Jest will automatically use this mock when firebase-admin is imported.
 */
export default {
  auth: () => mockAuth,
  credential: mockCredential,
  initializeApp: mockInitializeApp,
};
