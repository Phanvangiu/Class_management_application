import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  createdAt: Timestamp;
}

export interface SendMessagePayload {
  to: string;
  message: string;
}

export interface JoinRoomPayload {
  otherUserId: string;
}

export enum SocketEvents {
  AUTHENTICATE = "authenticate",
  JOIN_ROOM = "join_room",
  SEND_MESSAGE = "send_message",
  LEAVE_ROOM = "leave_room",
  TYPING = "typing",
  STOP_TYPING = "stop_typing",

  AUTHENTICATED = "authenticated",
  ROOM_JOINED = "room_joined",
  NEW_MESSAGE = "new_message",
  MESSAGE_SENT = "message_sent",
  CHAT_HISTORY = "chat_history",
  USER_TYPING = "user_typing",
  USER_STOP_TYPING = "user_stop_typing",
  ERROR = "error",

  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

export const getRoomId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join("_");
};
