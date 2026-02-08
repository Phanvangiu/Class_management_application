import { Server, Socket } from "socket.io";
import { AuthenticatedSocket } from "./socket.middleware";
import { chatService } from "../services/chat.service";
import {
  SocketEvents,
  getRoomId,
  JoinRoomPayload,
  SendMessagePayload,
} from "../models/chat";

export class SocketHandler {
  private io: Server;
  private userRooms: Map<string, Set<string>> = new Map();
  constructor(io: Server) {
    this.io = io;
  }

  handleConnection(socket: AuthenticatedSocket) {
    const userId = socket.userId!;
    const role = socket.role!;

    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }

    socket.emit(SocketEvents.AUTHENTICATED, {
      userId,
      role,
    });

    this.registerEventHandlers(socket);

    socket.on(SocketEvents.DISCONNECT, () => {
      this.handleDisconnect(socket);
    });
  }

  private registerEventHandlers(socket: AuthenticatedSocket) {
    socket.on(SocketEvents.JOIN_ROOM, (payload: JoinRoomPayload) => {
      this.handleJoinRoom(socket, payload);
    });

    socket.on(SocketEvents.SEND_MESSAGE, (payload: SendMessagePayload) => {
      this.handleSendMessage(socket, payload);
    });

    socket.on(SocketEvents.LEAVE_ROOM, (payload: JoinRoomPayload) => {
      this.handleLeaveRoom(socket, payload);
    });

    socket.on(SocketEvents.TYPING, (payload: { to: string }) => {
      this.handleTyping(socket, payload);
    });

    socket.on(SocketEvents.STOP_TYPING, (payload: { to: string }) => {
      this.handleStopTyping(socket, payload);
    });
  }

  private async handleJoinRoom(
    socket: AuthenticatedSocket,
    payload: JoinRoomPayload,
  ) {
    try {
      const userId = socket.userId!;
      const role = socket.role!;
      const { otherUserId } = payload;

      if (!otherUserId) {
        socket.emit(SocketEvents.ERROR, { message: "Other user ID required" });
        return;
      }

      const otherUser = await chatService.getUserInfo(otherUserId);
      if (!otherUser) {
        socket.emit(SocketEvents.ERROR, { message: "User not found" });
        return;
      }

      const canChat = await chatService.canUsersChatWithEachOther(
        userId,
        role,
        otherUserId,
        otherUser.role,
      );

      if (!canChat) {
        socket.emit(SocketEvents.ERROR, {
          message: "You are not authorized to chat with this user",
        });
        return;
      }

      if (role === "student" && otherUser.role === "instructor") {
        const canStudentChat = await chatService.canStudentChatWithInstructor(
          userId,
          otherUserId,
        );

        if (!canStudentChat) {
          socket.emit(SocketEvents.ERROR, {
            message: "You can only chat with your assigned instructor",
          });
          return;
        }
      }

      const roomId = getRoomId(userId, otherUserId);

      socket.join(roomId);
      this.userRooms.get(userId)?.add(roomId);

      const chatHistory = await chatService.getChatHistory(userId, otherUserId);

      socket.emit(SocketEvents.ROOM_JOINED, {
        roomId,
        otherUserId,
      });

      socket.emit(SocketEvents.CHAT_HISTORY, {
        messages: chatHistory.map((msg) => ({
          id: msg.id,
          from: msg.from,
          to: msg.to,
          message: msg.message,
          createdAt: msg.createdAt.toMillis(),
        })),
      });
    } catch (error) {
      socket.emit(SocketEvents.ERROR, {
        message: "Failed to join room",
      });
    }
  }

  private async handleSendMessage(
    socket: AuthenticatedSocket,
    payload: SendMessagePayload,
  ) {
    try {
      const userId = socket.userId!;
      const { to, message } = payload;

      if (!to || !message || message.trim() === "") {
        socket.emit(SocketEvents.ERROR, { message: "Invalid message data" });
        return;
      }

      const roomId = getRoomId(userId, to);

      if (!this.userRooms.get(userId)?.has(roomId)) {
        socket.emit(SocketEvents.ERROR, {
          message: "You must join the room first",
        });
        return;
      }

      const savedMessage = await chatService.saveMessage(
        userId,
        to,
        message.trim(),
      );

      const messageData = {
        id: savedMessage.id,
        from: savedMessage.from,
        to: savedMessage.to,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt.toMillis(),
      };

      this.io.to(roomId).emit(SocketEvents.NEW_MESSAGE, messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit(SocketEvents.ERROR, {
        message: "Failed to send message",
      });
    }
  }

  private handleLeaveRoom(
    socket: AuthenticatedSocket,
    payload: JoinRoomPayload,
  ) {
    const userId = socket.userId!;
    const { otherUserId } = payload;

    if (!otherUserId) {
      return;
    }

    const roomId = getRoomId(userId, otherUserId);
    socket.leave(roomId);
    this.userRooms.get(userId)?.delete(roomId);
  }

  private handleTyping(socket: AuthenticatedSocket, payload: { to: string }) {
    const userId = socket.userId!;
    const { to } = payload;

    if (!to) return;

    const roomId = getRoomId(userId, to);

    socket.to(roomId).emit(SocketEvents.USER_TYPING, {
      userId,
    });
  }

  private handleStopTyping(
    socket: AuthenticatedSocket,
    payload: { to: string },
  ) {
    const userId = socket.userId!;
    const { to } = payload;

    if (!to) return;

    const roomId = getRoomId(userId, to);

    socket.to(roomId).emit(SocketEvents.USER_STOP_TYPING, {
      userId,
    });
  }

  private handleDisconnect(socket: AuthenticatedSocket) {
    const userId = socket.userId!;

    this.userRooms.delete(userId);
  }
}
