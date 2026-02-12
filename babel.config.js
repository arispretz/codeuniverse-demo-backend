/**
 * @fileoverview Babel configuration for Node.js ESM environment.
 * Ensures compatibility with the current Node.js version.
 * @module babel.config
 */

export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' },
      },
    ],
  ],
};
