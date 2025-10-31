import React from "react";

export default function UserItem({ user, selected, onClick, isOnline = false, unreadCount = 0 }) {
  return (
    <div
      className={`mx-2 mb-1 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 flex items-center gap-3 ${
        selected 
          ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg transform scale-98" 
          : "hover:bg-gray-700 hover:bg-opacity-50 active:scale-95"
      }`}
      onClick={onClick}
    >
      {/* Avatar with Online Status */}
      <div className="relative flex-shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md transition-transform duration-200 ${
          selected 
            ? "bg-white bg-opacity-20" 
            : "bg-gradient-to-br from-purple-500 to-pink-500"
        }`}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        
        {/* Online Status Indicator */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
        )}

        {/* ✅ Unread Badge */}
        {unreadCount > 0 && !selected && (
          <div className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 rounded-full flex items-center justify-center px-1 border-2 border-gray-900">
            <span className="text-white text-xs font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className={`font-semibold truncate ${
            selected ? "text-white" : unreadCount > 0 ? "text-white" : "text-gray-200"
          }`}>
            {user.username}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`text-xs truncate ${
            selected ? "text-white text-opacity-70" : "text-gray-400"
          }`}>
            {user.email}
          </p>

          {/* ✅ Unread Count Text (alternative display) */}
          {unreadCount > 0 && !selected && (
            <span className="ml-2 text-xs font-bold text-red-400">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {/* Chevron Icon */}
      {selected && (
        <svg className="w-5 h-5 text-white text-opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}