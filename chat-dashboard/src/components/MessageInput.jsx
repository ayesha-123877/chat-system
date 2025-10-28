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
    <div className="bg-gray-800 bg-opacity-80 border-t border-gray-700 border-opacity-50 p-4">
      <div className="max-w-4xl mx-auto flex items-end gap-3">
        {/* Attachment Button */}
        <button 
          className="p-3 hover:bg-gray-700 hover:bg-opacity-50 rounded-xl transition-colors text-gray-400 hover:text-blue-400 flex-shrink-0"
          title="Attach file"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            rows="1"
            disabled={sending}
            className="w-full px-4 py-3 pr-12 bg-gray-700 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent transition-all resize-none overflow-hidden"
            style={{ maxHeight: "120px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Emoji Button */}
          <button 
            className="absolute right-3 top-3 p-1 hover:bg-gray-600 hover:bg-opacity-50 rounded-lg transition-colors text-gray-400 hover:text-yellow-400"
            title="Add emoji"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={sending || !text.trim()}
          className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500 hover:shadow-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0 transform hover:scale-105 active:scale-95"
          title="Send message"
        >
          {sending ? (
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      {/* Quick Info */}
      <div className="max-w-4xl mx-auto mt-2 px-1">
        <p className="text-xs text-gray-500">
          Press <kbd className="px-1.5 py-0.5 bg-gray-700 bg-opacity-50 rounded text-gray-400 font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-700 bg-opacity-50 rounded text-gray-400 font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}