/**
 * @fileoverview Entry point for the backend server.
 * Initializes Express app, database connection, Socket.IO, terminal setup, and global error handlers.
 * @module server
 */

import './config/env.js';
import './config/firebase.js';
import http from 'http';
import { app } from './app.js';
import { connectDB } from './DB/db.js';
import { setupSocket } from './socket.js';
import { setupTerminal } from './setupTerminal.js';
import { PORT } from './config/env.js';

/**
 * Global error handlers to prevent server crashes.
 */
process.on('uncaughtException', err => {
  console.error('💥 uncaughtException:', err.stack || err);
});
process.on('unhandledRejection', reason => {
  console.error('💥 unhandledRejection:', reason);
});

/**
 * Create HTTP server and attach Express app.
 */
const server = http.createServer(app);

/**
 * Initialize Socket.IO for chat and notifications.
 */
const io = setupSocket(server);
app.use((req, res, next) => {
  req.io = io;
  next();
});

/**
 * Initialize terminals (audited always, real only in development).
 */
setupTerminal(server);

/**
 * Starts the backend server with DB connection and socket setup.
 *
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
async function startServer() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err);
    process.exit(1);
  }
}

startServer();

export { io };
