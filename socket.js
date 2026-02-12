/**
 * @fileoverview Socket.IO server with Firebase authentication, role management, and heartbeat support.
 */

import { Server } from "socket.io";
import { getAuth } from "firebase-admin/auth";
import { User } from "./models/User.js";
import { runFastapiModel } from "./services/fastapiModelRunner.js";

const corsOriginsEnv = process.env.SOCKET_CORS_ORIGINS;
if (!corsOriginsEnv) {
  throw new Error("❌ SOCKET_CORS_ORIGINS must be defined");
}
const corsOrigins = corsOriginsEnv.split(",").map((o) => o.trim());

export function setupSocket(server) {
  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 120000, // more tolerance
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });

      socket.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: user?.role || "guest",
      };

      console.log(`🔐 Authenticated socket: ${socket.user.email} (${socket.user.role})`);
      next();
    } catch (err) {
      console.error("❌ Invalid token:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🧑 Connected: ${socket.user?.email}`);

    socket.emit("connected", { message: "Socket successfully connected 🚀" });

    // Heartbeat
    socket.on("heartbeat", (payload) => {
      console.log(`💓 Heartbeat from ${socket.user?.email} at ${new Date(payload.ts).toISOString()}`);
      socket.emit("heartbeat_ack", { ts: Date.now() });
    });

    // Assistant
    socket.on("assistant_prompt", async (prompt) => {
      try {
        const response = await runFastapiModel({
          prompt,
          language: "",
          user_id: socket.user.uid,
          user_level: socket.user.role,
        });
        socket.emit("assistant_response", response);
      } catch (err) {
        console.error("❌ Assistant error:", err.message);
        socket.emit("assistant_response", "Error generating response");
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`👋 Disconnected: ${socket.user?.email} (${reason})`);
    });
  });

  return io;
}
