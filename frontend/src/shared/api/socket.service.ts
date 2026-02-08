import { io, Socket } from "socket.io-client";

export const SocketEvents = {
  AUTHENTICATE: "authenticate",
  JOIN_ROOM: "join_room",
  SEND_MESSAGE: "send_message",
  LEAVE_ROOM: "leave_room",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",

  AUTHENTICATED: "authenticated",
  ROOM_JOINED: "room_joined",
  NEW_MESSAGE: "new_message",
  MESSAGE_SENT: "message_sent",
  CHAT_HISTORY: "chat_history",
  USER_TYPING: "user_typing",
  USER_STOP_TYPING: "user_stop_typing",
  ERROR: "error",

  CONNECT: "connect",
  DISCONNECT: "disconnect",
} as const;

class SocketService {
  socket: Socket | null = null;

  connect(token: string) {
    if (!token) {
      return;
    }

    this.socket = io("http://localhost:3001", {
      auth: { token },
    });

    this.socket.on(SocketEvents.CONNECT, () => {});

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });

    this.socket.on(SocketEvents.AUTHENTICATED, (data) => {});

    this.socket.on(SocketEvents.ERROR, (error) => {
      console.error("Socket error:", error);
    });

    this.socket.onAny((eventName, ...args) => {
      console.log(`📡 Socket Event: "${eventName}"`, args);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinRoom(otherUserId: string, onSuccess?: () => void) {
    if (!this.socket) {
      console.error("❌ Socket not connected");
      return;
    }

    this.socket.emit(SocketEvents.JOIN_ROOM, { otherUserId });

    this.socket.once(SocketEvents.ROOM_JOINED, (data) => {
      onSuccess?.();
    });
  }

  leaveRoom(otherUserId: string) {
    if (!this.socket) return;
    this.socket.emit(SocketEvents.LEAVE_ROOM, { otherUserId });
  }

  onChatHistory(cb: (data: { messages: any[] }) => void) {
    if (!this.socket) return () => {};

    this.socket.on(SocketEvents.CHAT_HISTORY, (data) => {
      cb(data);
    });

    return () => {
      this.socket?.off(SocketEvents.CHAT_HISTORY, cb);
    };
  }

  onNewMessage(cb: (data: any) => void) {
    if (!this.socket) return () => {};

    this.socket.on(SocketEvents.NEW_MESSAGE, (data) => {
      cb(data);
    });

    return () => {
      this.socket?.off(SocketEvents.NEW_MESSAGE, cb);
    };
  }

  sendMessage(payload: { to: string; message: string }) {
    if (!this.socket) {
      return;
    }

    this.socket.emit(SocketEvents.SEND_MESSAGE, payload);
  }

  startTyping(to: string) {
    if (!this.socket) return;
    this.socket.emit(SocketEvents.TYPING, { to });
  }

  stopTyping(to: string) {
    if (!this.socket) return;
    this.socket.emit(SocketEvents.STOP_TYPING, { to });
  }

  onUserTyping(cb: (data: { userId: string }) => void) {
    if (!this.socket) return () => {};

    this.socket.on(SocketEvents.USER_TYPING, cb);

    return () => {
      this.socket?.off(SocketEvents.USER_TYPING, cb);
    };
  }

  onUserStopTyping(cb: (data: { userId: string }) => void) {
    if (!this.socket) return () => {};

    this.socket.on(SocketEvents.USER_STOP_TYPING, cb);

    return () => {
      this.socket?.off(SocketEvents.USER_STOP_TYPING, cb);
    };
  }
}

export const socketService = new SocketService();
