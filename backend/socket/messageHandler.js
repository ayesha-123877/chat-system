import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

export function handleMessage(io, socket) {
  socket.on("sendMessage", async ({ conversationId, text, attachments = [] }) => {
    try {
      console.log(" Sending message:", { conversationId, text, attachments });

      //  FIXED: Save message with attachments
      const msg = await Message.create({
        conversationId,
        sender: socket.user.id,
        text: text || "", // Empty if only attachment
        attachments: attachments || [], // Include attachments
      });

      // Populate sender info
      await msg.populate("sender", "username email");

      // Update conversation
      const lastMessageText = text || (attachments.length > 0 ? "📎 Attachment" : "");
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: lastMessageText,
        lastMessageTime: Date.now()
      });

      //  FIXED: Send complete message with attachments
      const messageData = {
        _id: msg._id,
        conversationId: msg.conversationId,
        sender: {
          _id: msg.sender._id,
          username: msg.sender.username,
          email: msg.sender.email
        },
        text: msg.text,
        attachments: msg.attachments || [], //  Include attachments in broadcast
        createdAt: msg.createdAt,
      };

      console.log(" Broadcasting message with attachments:", messageData);

      // Broadcast to all users in room
      io.to(conversationId).emit("receiveMessage", messageData);
      
    } catch (err) {
      console.error(" sendMessage error:", err);
      socket.emit("errorMessage", { message: "Message send failed", error: err.message });
    }
  });
}