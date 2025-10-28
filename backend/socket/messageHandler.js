import Message from "../models/messageModel.js";

export function handleMessage(io, socket) {
  socket.on("sendMessage", async ({ conversationId, text }) => {
    try {
      // 1) save message in MongoDB
      const msg = await Message.create({
        conversationId,
        sender: socket.user.id,
        text,
      });

      // 2) broadcast to all users in room
      io.to(conversationId).emit("receiveMessage", {
        _id: msg._id,
        conversationId: msg.conversationId,
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.createdAt,
      });
    } catch (err) {
      console.error("sendMessage error:", err);
      socket.emit("errorMessage", { message: "Message send failed" });
    }
  });
}
