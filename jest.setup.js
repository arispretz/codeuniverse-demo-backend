/**
 * @fileoverview Jest setup file for CodeUniverse backend tests.
 * Configures global test behavior, utilities, and error handling.
 * @module jest.setup
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' }); 

// 🧹 Global cleanup before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// 🛑 Handle unhandled promise rejections during tests
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection in test:', reason);
});

