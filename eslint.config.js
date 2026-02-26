/**
 * @fileoverview ESLint configuration for backend (Flat Config).
 * Ensures consistent code style, enforces best practices, and prevents common issues.
 * @module eslint.config
 */

import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
      },
    },
    plugins: {
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
    },
  },
];
