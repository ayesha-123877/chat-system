import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function MessageInput({ conversationId }) {
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = () => {
    if (!socket || !text.trim() || sending) return;

    setSending(true);
    socket.emit("sendMessage", { conversationId, text: text.trim() });
    setText("");
    setTimeout(() => setSending(false), 100);
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-2">
      <input
        type="text"
        className="flex-1 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        disabled={sending}
      />
      <button
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={sendMessage}
        disabled={sending || !text.trim()}
      >
        Send
      </button>
    </div>
  );
}