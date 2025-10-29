import React from "react";

export default function Message({ message, isOwn }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const getSenderInitial = () => {
    if (message.sender?.username) {
      return message.sender.username.charAt(0).toUpperCase();
    }
    if (message.senderUsername) {
      return message.senderUsername.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getSenderName = () => {
    return message.sender?.username || message.senderUsername || "Unknown";
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith("image/")) return "🖼️";
    if (fileType?.startsWith("video/")) return "🎥";
    if (fileType?.includes("pdf")) return "📄";
    if (fileType?.includes("doc")) return "📝";
    return "📎";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const mb = (bytes / 1024 / 1024).toFixed(2);
    return `${mb} MB`;
  };

  return (
    <div className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-2 max-w-md ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-md">
            {getSenderInitial()}
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
          {/* Sender name */}
          {!isOwn && (
            <p className="text-xs font-semibold text-blue-400 mb-1">
              {getSenderName()}
            </p>
          )}

          {/* NEW: Display attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2">
              {message.attachments.map((file, index) => (
                <div key={index} className="mb-2">
                  {/* Image preview */}
                  {file.fileType?.startsWith("image/") ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={file.url} 
                        alt={file.filename}
                        className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition"
                      />
                    </a>
                  ) : (
                    /* File download link */
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-2 rounded-lg transition ${
                        isOwn 
                          ? "bg-white bg-opacity-20 hover:bg-opacity-30" 
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <span className="text-2xl">{getFileIcon(file.fileType)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.filename}</p>
                        {file.fileSize && (
                          <p className="text-xs opacity-70">{formatFileSize(file.fileSize)}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message text */}
          {message.text && (
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message.text}
            </p>
          )}

          {/* Timestamp */}
          <div className={`flex items-center gap-1 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}>
            <p className={`text-xs ${
              isOwn ? "text-blue-100 text-opacity-70" : "text-gray-400"
            }`}>
              {formatTime(message.createdAt)}
            </p>

            {isOwn && (
              <svg className="w-3.5 h-3.5 text-blue-100 text-opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {/* Message tail */}
          <div className={`absolute bottom-0 ${
            isOwn ? "-right-1" : "-left-1"
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