import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

export function handleMessage(io, socket) {
  socket.on("sendMessage", async ({ conversationId, text, attachments = [] }) => {
    try {
      console.log(" Sending message:", { conversationId, text, attachments });

      // Save message
      const msg = await Message.create({
        conversationId,
        sender: socket.user.id,
        text: text || "",
        attachments: attachments || [],
      });

      // Populate sender info
      await msg.populate("sender", "username email");

      // Update conversation
      const lastMessageText = text || (attachments.length > 0 ? "📎 Attachment" : "");
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: lastMessageText,
          lastMessageTime: Date.now(),
          //  Increment unread count for receiver
          $inc: { unreadCount: 1 }
        },
        { new: true }
      );

      // Broadcast message
      const messageData = {
        _id: msg._id,
        conversationId: msg.conversationId,
        sender: {
          _id: msg.sender._id,
          username: msg.sender.username,
          email: msg.sender.email
        },
        text: msg.text,
        attachments: msg.attachments || [],
        createdAt: msg.createdAt,
      };

      console.log(" Broadcasting message:", messageData);
      io.to(conversationId).emit("receiveMessage", messageData);

      //  Broadcast unread count update
      io.to(conversationId).emit("unreadCountUpdate", {
        conversationId,
        unreadCount: conversation.unreadCount
      });
      
    } catch (err) {
      console.error(" sendMessage error:", err);
      socket.emit("errorMessage", { message: "Message send failed", error: err.message });
    }
  });

  //  Mark messages as read
  socket.on("markAsRead", async ({ conversationId }) => {
    try {
      await Conversation.findByIdAndUpdate(conversationId, {
        unreadCount: 0
      });

      io.to(conversationId).emit("unreadCountUpdate", {
        conversationId,
        unreadCount: 0
      });

      console.log(` Marked conversation ${conversationId} as read`);
    } catch (err) {
      console.error(" markAsRead error:", err);
    }
  });
}