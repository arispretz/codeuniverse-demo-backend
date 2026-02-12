/**
 * @fileoverview Jest configuration for ESM-based Node.js testing.
 * Provides setup for test environment, file matching, Babel transformation, and coverage reporting.
 * @module jest.config
 */

export default {
  testEnvironment: 'node',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).[jt]s'
  ],

  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },

  moduleFileExtensions: ['js', 'jsx'],

  collectCoverage: true,
  coverageDirectory: 'coverage',

  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.config.js',
    'jest.setup.js',
  ],

  verbose: true,
};
