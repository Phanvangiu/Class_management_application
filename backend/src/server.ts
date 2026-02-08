// src/server.ts
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { authenticateSocket } from "./socket/socket.middleware";
import { SocketHandler } from "./socket/socket.handler";

dotenv.config();

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  transports: ["websocket", "polling"],
});
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

io.use(authenticateSocket);

const socketHandler = new SocketHandler(io);

io.on("connection", (socket) => {
  socketHandler.handleConnection(socket as any);
});

const performStartupChecks = async () => {
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️  JWT_SECRET not set");
  }

  if (!process.env.FRONTEND_URL) {
    console.warn("⚠️  FRONTEND_URL not set, using default");
  }
};

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  try {
    await performStartupChecks();

    // Start listening
    httpServer.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on ${HOST}:${PORT}`);
      console.log(`📡 Socket.io ready for connections`);
      console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

const gracefulShutdown = (signal: string) => {
  httpServer.close(() => {
    io.close(() => {
      process.exit(0);
    });
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  gracefulShutdown("UNHANDLED_REJECTION");
});

startServer();

export { io };
