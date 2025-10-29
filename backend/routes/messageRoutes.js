import express from "express";
import { 
  getOrCreateConversation, 
  getMessages, 
  getUserConversations,
  clearChat  // ✅ NEW
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.post("/conversation", verifyToken, getOrCreateConversation);
router.get("/conversation/:conversationId", verifyToken, getMessages);
router.get("/conversations", verifyToken, getUserConversations);

// ✅ NEW: Clear chat route
router.delete("/conversation/:conversationId", verifyToken, clearChat);

export default router;