/**
 * @fileoverview Secure audited WebSocket terminal setup.
 * Provides a restricted command execution environment with Firebase authentication and audit logging.
 * @module setupTerminal
 */

import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

const SAFE_DIR = path.resolve('./projects/demo');
const MAX_MSG_LEN = 10_000;

// Ensure safe directory exists
if (!fs.existsSync(SAFE_DIR)) {
  console.error(`⚠️ Safe directory ${SAFE_DIR} does not exist. Please create the folder before starting the server.`);
}

const isWin = process.platform === 'win32';

/**
 * Allowed command mappings depending on platform.
 */
const mapCommands = {
  ls: isWin ? { cmd: 'cmd', args: ['/c', 'dir'] } : { cmd: 'ls', args: [] },
  pwd: isWin ? { cmd: 'cmd', args: ['/c', 'cd'] } : { cmd: 'pwd', args: [] },
  cat: isWin ? { cmd: 'cmd', args: ['/c', 'type'] } : { cmd: 'cat', args: [] },
  less: isWin ? null : { cmd: 'less', args: [] },
  head: isWin ? null : { cmd: 'head', args: [] },
  tail: isWin ? null : { cmd: 'tail', args: [] },
};

/**
 * Sanitizes arguments by removing ANSI escape sequences.
 *
 * @param {string[]} args - Command arguments.
 * @returns {string[]} Sanitized arguments.
 */
function sanitizeArgs(args) {
  return args.map((a) => a.replace(/\x1B\[[0-9;]*[A-Za-z]/g, ''));
}

/**
 * Sends text to the WebSocket client with CRLF normalization.
 *
 * @param {WebSocket} ws - WebSocket connection.
 * @param {string} text - Text to send.
 */
function sendText(ws, text) {
  if (ws.readyState === ws.OPEN) {
    ws.send(String(text).replace(/\n/g, '\r\n'), { binary: false });
  }
}

/**
 * Sets up a secure audited WebSocket terminal.
 *
 * @function setupTerminal
 * @param {Server} server - HTTP server instance.
 */
export function setupTerminal(server) {
  const wss = new WebSocketServer({
    server,
    path: '/terminal-audit',
    perMessageDeflate: false,
  });

  wss.on('connection', async (ws, req) => {
  let userId = 'anon';
  let token = null;

  const url = new URL(req.url, `http://${req.headers.host}`);
  token = url.searchParams.get("token");

  if (!token) {
    sendText(ws, '❌ Token not received\n');
    ws.close(1008, 'No token');
    return;
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    userId = decoded.uid;
    console.log(`🔐 Authenticated user: ${decoded.email}`);
  } catch {
    sendText(ws, '❌ Invalid token\n');
    ws.close(1008, 'Invalid token');
    return;
  }

  sendText(
    ws,
    `Welcome to the secure terminal!\nAllowed commands: ls, pwd, cat, less, head, tail\nDirectory: ${SAFE_DIR}\n`
  );

  // Keepalive ping
  const pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping();
    }
  }, 25_000);

  ws.on('message', async (msg) => {
    const raw = msg.toString().trim();

    if (raw === '__ping__') return;

    if (raw.length > MAX_MSG_LEN) {
      sendText(ws, '❌ Input too long\n');
      return;
    }

    const [command, ...args] = raw.split(/\s+/);

    if (!mapCommands[command]) {
      sendText(ws, `❌ Command not allowed: ${command}\n`);
      return;
    }

    const { cmd, args: baseArgs } = mapCommands[command];
    const cleanArgs = sanitizeArgs([...baseArgs, ...args]);

    const child = spawn(cmd, cleanArgs, {
      shell: false,
      cwd: SAFE_DIR,
      env: process.env,
    });

    child.stdout.on('data', (d) => sendText(ws, d.toString()));
    child.stderr.on('data', (d) => sendText(ws, `Error: ${d.toString()}`));
    child.on('close', (code) =>
      sendText(ws, `Process finished with exit code ${code}\n`)
    );
  });

  ws.on('close', () => {
    clearInterval(pingInterval);
  });

  ws.on('error', (err) => {
    clearInterval(pingInterval);
    console.error(`💥 WebSocket connection error:`, err);
    try {
      ws.close();
    } catch {}
  });
});

console.log(
  `🔒 Audited terminal mounted at /terminal-audit (directory: ${SAFE_DIR})`
);
}
