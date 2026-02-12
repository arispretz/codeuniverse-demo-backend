/**
 * @fileoverview Utility for linting source code.
 * Supports JavaScript (via ESLint) and Python (via Pylint).
 * Provides a unified interface to return linting messages.
 * @module lint/lintRunner
 */

import { ESLint } from 'eslint';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Lints code based on the specified language.
 * Supports JavaScript (via ESLint) and Python (via Pylint).
 *
 * @async
 * @function lintCode
 * @param {string} code - Source code to lint.
 * @param {string} language - Language identifier ('javascript' or 'python').
 * @returns {Promise<Array>} Array of linting messages with line, column, message, and severity.
 */
export async function lintCode(code, language) {
  if (language === 'javascript') {
    const eslint = new ESLint(); // Uses default ESLint configuration
    const results = await eslint.lintText(code);

    return results[0].messages.map(msg => ({
      line: msg.line,
      column: msg.column,
      message: msg.message,
      severity: msg.severity === 2 ? 'error' : 'warning',
    }));
  }

  if (language === 'python') {
    try {
      // Run pylint with JSON output format
      const { stdout } = await execAsync('pylint --from-stdin --output-format=json', {
        input: code,
        maxBuffer: 1024 * 500,
      });

      const messages = JSON.parse(stdout).map(msg => ({
        line: msg.line,
        column: msg.column,
        message: msg.message,
        severity: msg.type === 'error' ? 'error' : 'warning',
      }));

      return messages;
    } catch (err) {
      console.error('❌ Pylint error:', err);
      return [{
        line: 0,
        column: 0,
        message: 'Failed to lint Python code',
        severity: 'error',
      }];
    }
  }

  throw new Error(`Unsupported language: ${language}`);
}
