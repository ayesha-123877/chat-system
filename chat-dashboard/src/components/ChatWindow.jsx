import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import Message from "./Message";
import axios from "axios";

export default function ChatWindow({ conversationId, currentUserId }) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      } catch (err) {
        console.error("Load messages error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("joinRoom", conversationId);

    const handleReceive = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      {messages.length === 0 ? (
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
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}