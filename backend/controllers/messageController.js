import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

// Get or create conversation between two users
export const getOrCreateConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other user ID required" });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    // Create new if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, otherUserId]
      });
    }

    res.json(conversation);
  } catch (err) {
    console.error("Get/Create conversation error:", err);
    res.status(500).json({ message: "Failed to get conversation", error: err.message });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const messages = await Message.find({ conversationId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

// Get all conversations for current user
export const getUserConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const conversations = await Conversation.find({
      participants: currentUserId
    })
      .populate("participants", "username email")
      .sort({ lastMessageTime: -1 });

    res.json(conversations);
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ message: "Failed to fetch conversations", error: err.message });
  }
};

//  NEW: Clear chat (delete all messages in conversation)
export const clearChat = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(currentUserId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete all messages in this conversation
    const result = await Message.deleteMany({ conversationId });

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: "",
      lastMessageTime: Date.now()
    });

    res.json({ 
      message: "Chat cleared successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error("Clear chat error:", err);
    res.status(500).json({ message: "Failed to clear chat", error: err.message });
  }
};