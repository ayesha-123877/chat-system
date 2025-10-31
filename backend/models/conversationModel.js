import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }
  ],
  lastMessage: { 
    type: String, 
    default: "" 
  },
  lastMessageTime: { 
    type: Date, 
    default: Date.now 
  },
  // ✅ NEW: Unread message count
  unreadCount: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for faster queries
conversationSchema.index({ participants: 1 });

export default mongoose.model("Conversation", conversationSchema);