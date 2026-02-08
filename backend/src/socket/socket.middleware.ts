import { Socket } from "socket.io";
import { verifyToken } from "../services/verifyToken";

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: "instructor" | "student";
}

export const authenticateSocket = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void,
) => {
  try {
    const token =
      socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();

    const decoded: any = verifyToken(cleanToken);

    if (!decoded) {
      return next(new Error("Invalid or expired token"));
    }

    const userId = decoded.userId || decoded.email || decoded.id || decoded.sub;
    const role = decoded.role || decoded.userRole || decoded.type;

    if (!userId || !role) {
      return next(new Error("Invalid token structure"));
    }

    socket.userId = userId;
    socket.role = role;

    next();
  } catch (error: any) {
    next(new Error("Authentication failed"));
  }
};
