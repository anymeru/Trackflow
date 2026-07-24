import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join:tracking", (trackingId: string) => {
      socket.join(`tracking:${trackingId}`);
      console.log(`${socket.id} joined tracking:${trackingId}`);
    });

    socket.on("leave:tracking", (trackingId: string) => {
      socket.leave(`tracking:${trackingId}`);
      console.log(`${socket.id} left tracking:${trackingId}`);
    });

    socket.on("position:set", (data: { trackingId: string; progressPercent: number }) => {
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
