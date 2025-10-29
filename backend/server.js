import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

// config imports
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { setUserOnline, setUserOffline, getAllOnlineUsers } from "./utils/redisHelper.js";

// routes & socket handlers
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { handleMessage } from "./socket/messageHandler.js";

dotenv.config();
connectDB();
connectRedis();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (_, res) => res.send(" Chat server active!"));

//  Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("auth error: token missing"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: payload.id, username: payload.username };
    next();
  } catch (err) {
    next(new Error("auth error: invalid token"));
  }
});

//  FIXED: Socket connection logic with better online status
io.on("connection", async (socket) => {
  const userId = socket.user.id;
  console.log(` Socket connected: ${socket.id} (User: ${userId})`);

  // Mark user online
  await setUserOnline(userId, socket.id);
  
  // Get all online users
  const onlineUsers = await getAllOnlineUsers();
  console.log(` Total online users: ${onlineUsers.length}`);
  
  // Broadcast to ALL clients (including sender)
  io.emit("userOnline", { userId, onlineUsers });

  // Send current online users to newly connected user
  socket.emit("onlineUsersList", { onlineUsers });

  // Join room
  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(` User ${userId} joined room ${conversationId}`);
  });

  // Handle messages
  handleMessage(io, socket);

  // Typing indicator
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit("userTyping", {
      conversationId,
      userId,
      isTyping,
    });
  });

  //  FIXED: Better disconnect handling
  socket.on("disconnect", async (reason) => {
    console.log(` User ${userId} disconnected (Reason: ${reason})`);
    
    await setUserOffline(userId);
    
    const onlineUsers = await getAllOnlineUsers();
    
    // Broadcast to ALL remaining clients
    io.emit("userOffline", { userId, onlineUsers });
  });

  //  Handle reconnection
  socket.on("reconnect", async () => {
    console.log(` User ${userId} reconnected`);
    await setUserOnline(userId, socket.id);
    io.emit("userOnline", { userId });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));