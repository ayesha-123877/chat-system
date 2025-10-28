import React from "react";

export default function Message({ message, isOwn }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-2 max-w-md ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar for received messages */}
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-md">
            {message.sender?.username?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-2 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
            isOwn
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm"
              : "bg-gray-800 bg-opacity-80 text-gray-100 rounded-bl-sm border border-gray-700 border-opacity-50"
          }`}
        >
          {/* Sender name for received messages */}
          {!isOwn && message.sender?.username && (
            <p className="text-xs font-semibold text-blue-400 mb-1">
              {message.sender.username}
            </p>
          )}

          {/* Message text */}
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.text}
          </p>

          {/* Timestamp */}
          <div className={`flex items-center gap-1 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}>
            <p className={`text-xs ${
              isOwn ? "text-blue-100 text-opacity-70" : "text-gray-400"
            }`}>
              {formatTime(message.createdAt)}
            </p>

            {/* Read receipt for sent messages */}
            {isOwn && (
              <svg className="w-3.5 h-3.5 text-blue-100 text-opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {/* Message tail - Simple triangle */}
          <div className={`absolute bottom-0 ${
            isOwn 
              ? "-right-1" 
              : "-left-1"
          }`}>
            <div className={`w-0 h-0 ${
              isOwn 
                ? "border-l-8 border-l-blue-500 border-t-8 border-t-transparent"
                : "border-r-8 border-r-gray-800 border-t-8 border-t-transparent"
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}