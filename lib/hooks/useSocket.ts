"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://brewiq-api-production.up.railway.app";

interface UseSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export function useSocket(options: UseSocketOptions = {}) {
  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options;

  const { isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = getAccessToken();
    if (!token) {
      setConnectionError("Not authenticated");
      return;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      setConnectionError(error.message);
      setIsConnected(false);
    });
  }, [reconnection, reconnectionAttempts, reconnectionDelay]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback(
    <T>(event: string, data?: T) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data);
      }
    },
    []
  );

  const on = useCallback(
    <T>(event: string, callback: (data: T) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    []
  );

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  useEffect(() => {
    if (autoConnect && isAuthenticated) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, isAuthenticated, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

// Hook for notifications specifically
export function useNotificationSocket() {
  const { on, off, isConnected } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleNotification = (...args: unknown[]) => {
      const data = args[0] as { type: string; count?: number } | undefined;
      if (data?.type === "unread_count") {
        setUnreadCount(data.count || 0);
      } else {
        // New notification received, increment count
        setUnreadCount((prev) => prev + 1);
      }
    };

    on("notification", handleNotification);

    return () => {
      off("notification", handleNotification);
    };
  }, [on, off]);

  return {
    isConnected,
    unreadCount,
    setUnreadCount,
  };
}
