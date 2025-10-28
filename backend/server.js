import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

// config imports
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { setUserOnline, setUserOffline } from "./utils/redisHelper.js";

// routes & socket handlers
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"; // ✅ ADD THIS
import { handleMessage } from "./socket/messageHandler.js";

dotenv.config();
connectDB();
connectRedis();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes); // ✅ ADD THIS

// base route
app.get("/", (_, res) => res.send("💬 Chat server active!"));

// ✅ Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("auth error: token missing"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: payload.id, username: payload.username }; // ✅ ADD username
    next();
  } catch (err) {
    next(new Error("auth error: invalid token"));
  }
});

// ✅ Socket connection logic
io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id} (User: ${socket.user?.id})`);

  // mark online
  setUserOnline(socket.user.id, socket.id);
  io.emit("userOnline", { userId: socket.user.id });

  // join room
  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`🟢 User ${socket.user.id} joined room ${conversationId}`);
  });

  // handle messages
  handleMessage(io, socket);

  // typing indicator
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit("userTyping", {
      conversationId,
      userId: socket.user.id,
      isTyping,
    });
  });

  // disconnect
  socket.on("disconnect", async () => {
    await setUserOffline(socket.user.id);
    io.emit("userOffline", { userId: socket.user.id });
    console.log(`❌ User ${socket.user.id} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));