import React from "react";
import UserItem from "./UserItem";

export default function Sidebar({ users = [], selectedUserId, onSelectUser, onlineUsers = new Set() }) {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-blue-400">Messages</h2>
        <p className="text-xs text-gray-400 mt-1">
          {users.length} {users.length === 1 ? "user" : "users"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {users.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            <p>No users available</p>
          </div>
        ) : (
          users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              selected={user._id === selectedUserId}
              onClick={() => onSelectUser(user)}
              isOnline={onlineUsers.has(user._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}