import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "@/constants/main";
import io, { Socket } from "socket.io-client";

export const useSocket = () => {
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the backend Socket.IO server
    const newSocket = io(`${BACKEND_URL}/`, {
      transports: ["websocket"],
    });

    // Listen for notifications
    newSocket.on("receiveNotification", ({ message }) => {
      console.log("Notification received:", message);
      setNotification(message);
    });

    // Set up the socket instance
    setSocket(newSocket);

    // Clean up the socket connection on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket };
};
