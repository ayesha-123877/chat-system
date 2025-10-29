import React, { useState } from "react";
import UserItem from "./UserItem";

export default function Sidebar({ 
  users = [], 
  selectedUserId, 
  onSelectUser, 
  onlineUsers = new Set(),
  currentUsername = "",
  onLogout
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count online users from filtered list
  const onlineCount = filteredUsers.filter(user => onlineUsers.has(user._id)).length;

  return (
    <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Sidebar Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {currentUsername.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Chats</h2>
              <p className="text-xs text-gray-400">{currentUsername}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors text-red-400 hover:text-red-300"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Search Bar - WORKING */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Clear Search Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Users Count - FIXED */}
      <div className="px-4 py-2 bg-gray-900 bg-opacity-30">
        <p className="text-xs text-gray-400 font-medium">
          {filteredUsers.length} {filteredUsers.length === 1 ? "contact" : "contacts"}
          {searchQuery && ` found`} • {onlineCount} online
        </p>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 bg-opacity-30 flex items-center justify-center">
              {searchQuery ? (
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : "No contacts yet"}
            </p>
            {!searchQuery && (
              <p className="text-gray-500 text-xs mt-1">Start by adding some friends!</p>
            )}
          </div>
        ) : (
          <div className="py-2">
            {filteredUsers.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                selected={user._id === selectedUserId}
                onClick={() => onSelectUser(user)}
                isOnline={onlineUsers.has(user._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}