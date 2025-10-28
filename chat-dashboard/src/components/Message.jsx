import React from "react";

export default function Message({ message, isOwn }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex mb-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-700 text-gray-100 rounded-bl-none"
        }`}
      >
        {!isOwn && message.sender?.username && (
          <p className="text-xs text-gray-300 mb-1 font-semibold">
            {message.sender.username}
          </p>
        )}
        <p className="text-sm break-words">{message.text}</p>
        <p className="text-xs mt-1 opacity-70">
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}