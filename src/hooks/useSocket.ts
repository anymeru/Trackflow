import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined;

export function useSocket(trackingIds: string[]) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL);
    }

    const socket = socketRef.current;

    trackingIds.forEach((id) => {
      socket.emit("join:tracking", id);
    });

    return () => {
      trackingIds.forEach((id) => {
        socket.emit("leave:tracking", id);
      });
    };
  }, [trackingIds]);

  return socketRef.current;
}
