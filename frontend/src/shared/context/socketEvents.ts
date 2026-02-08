export const SocketEvents = {
  AUTHENTICATED: "authenticated",
  DISCONNECT: "disconnect",
  ERROR: "error",

  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  ROOM_JOINED: "room_joined",

  SEND_MESSAGE: "send_message",
  NEW_MESSAGE: "new_message",
  CHAT_HISTORY: "chat_history",

  TYPING: "typing",
  STOP_TYPING: "stop_typing",
  USER_TYPING: "user_typing",
  USER_STOP_TYPING: "user_stop_typing",
} as const;
