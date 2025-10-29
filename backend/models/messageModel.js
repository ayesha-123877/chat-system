import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Conversation", 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  text: { 
    type: String,
    default: "" 
  },
  // ✅ NEW: Attachments field
  attachments: [{
    url: { type: String, required: true },
    filename: { type: String, required: true },
    fileType: { type: String }, // image, video, document
    fileSize: { type: Number }, // in bytes
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }]
});

export default mongoose.model("Message", messageSchema);