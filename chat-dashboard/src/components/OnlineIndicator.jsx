import React from "react";

export default function OnlineIndicator({ isOnline }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full mr-2 ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      }`}
    />
  );
}
