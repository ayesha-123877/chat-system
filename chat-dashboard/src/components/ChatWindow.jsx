import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import Message from "./Message";
import axios from "axios";

export default function ChatWindow({ conversationId, currentUserId, searchQuery }) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/messages/conversation/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);

        // ✅ Mark as read when opening chat
        if (socket) {
          socket.emit("markAsRead", { conversationId });
        }
      } catch (err) {
        console.error("Load messages error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, socket]);

  // Join room and listen for new messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("joinRoom", conversationId);

    const handleReceive = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
        
        // ✅ Mark as read immediately when chat is open
        socket.emit("markAsRead", { conversationId });
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [socket, conversationId]);

  // ✅ Listen for typing indicator
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleTyping = ({ userId, isTyping: typing }) => {
      if (userId === currentUserId) return; // Ignore own typing

      setIsTyping(typing);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Auto-hide typing indicator after 3 seconds
      if (typing) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    socket.on("userTyping", handleTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, conversationId, currentUserId]);

  // Auto scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3 mx-auto"></div>
          <p className="text-gray-400 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900 bg-opacity-80 p-6">
      {messages.length === 0 && !isTyping ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center bg-gray-800 bg-opacity-30 rounded-2xl p-8 max-w-md">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg font-medium mb-2">No messages yet</p>
            <p className="text-gray-500 text-sm">Send a message to start the conversation!</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => {
            const showDate = index === 0 || 
              new Date(messages[index - 1].createdAt).toDateString() !== 
              new Date(msg.createdAt).toDateString();

            return (
              <React.Fragment key={msg._id}>
                {showDate && (
                  <div className="flex justify-center my-6">
                    <div className="bg-gray-800 bg-opacity-50 px-4 py-1 rounded-full">
                      <p className="text-xs text-gray-400 font-medium">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                )}
                <Message
                  message={msg}
                  isOwn={msg.sender._id === currentUserId || msg.sender === currentUserId}
                />
              </React.Fragment>
            );
          })}

          {/* ✅ Typing Indicator */}
          {isTyping && (
            <div className="flex mb-4 justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-md">
                  <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <div className="bg-gray-800 bg-opacity-80 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-700 border-opacity-50 shadow-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}