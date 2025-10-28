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
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for faster queries
conversationSchema.index({ participants: 1 });

export default mongoose.model("Conversation", conversationSchema);