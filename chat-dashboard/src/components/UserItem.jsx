import React from "react";
import OnlineIndicator from "./OnlineIndicator";

export default function UserItem({ user, selected, onClick, isOnline = false }) {
  return (
    <div
      className={`p-3 mb-2 cursor-pointer rounded-lg transition flex items-center ${
        selected 
          ? "bg-blue-600 text-white" 
          : "bg-gray-800 hover:bg-gray-700 text-gray-200"
      }`}
      onClick={onClick}
    >
      <OnlineIndicator isOnline={isOnline} />
      <div className="flex-1">
        <p className="font-medium">{user.username}</p>
        <p className="text-xs opacity-75">{user.email}</p>
      </div>
    </div>
  );
}