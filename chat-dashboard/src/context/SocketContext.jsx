import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      console.log(" No token found, skipping socket connection");
      return;
    }

    console.log("🔌 Attempting socket connection...");

    const socket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(" Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log(" Socket disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error(" Socket connection error:", err.message);
      setConnected(false);
    });

    //  CRITICAL: Listen for online/offline events
    socket.on("userOnline", (data) => {
      console.log("👤 User came online:", data);
    });

    socket.on("userOffline", (data) => {
      console.log("👤 User went offline:", data);
    });

    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);