import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

interface SocketUser {
  userId: string;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  user: SocketUser;
}

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    try {
      const payload = jwt.verify(token as string, config.jwtSecret) as SocketUser;
      (socket as AuthenticatedSocket).user = payload;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const authedSocket = socket as AuthenticatedSocket;
    console.log(`Socket connected: ${socket.id} (user: ${authedSocket.user?.userId})`);

    socket.on("join:tracking", (trackingId: string) => {
      socket.join(`tracking:${trackingId}`);
      console.log(`${socket.id} joined tracking:${trackingId}`);
    });

    socket.on("leave:tracking", (trackingId: string) => {
      socket.leave(`tracking:${trackingId}`);
      console.log(`${socket.id} left tracking:${trackingId}`);
    });

    socket.on("position:set", (data: { trackingId: string; progressPercent: number }) => {
      const role = authedSocket.user?.role;
      if (role !== "admin" && role !== "operator") return;
      socket.to(`tracking:${data.trackingId}`).emit("position:updated", data);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
