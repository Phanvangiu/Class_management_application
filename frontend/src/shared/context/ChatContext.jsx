import { createContext, useEffect, useRef } from "react";
import { socketService } from "../api/socket.service";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { token } = useAuth();
  const hasConnectedRef = useRef(false);
  const lastTokenRef = useRef(null);

  useEffect(() => {
    const cookieToken = Cookies.get("CLIENT_ACCESS_TOKEN");
    const finalToken = token || cookieToken;

    if (!finalToken) {
      return;
    }

    if (hasConnectedRef.current && lastTokenRef.current === finalToken) {
      return;
    }

    if (hasConnectedRef.current && lastTokenRef.current !== finalToken) {
      socketService.disconnect();
      hasConnectedRef.current = false;
    }

    try {
      socketService.connect(finalToken);
      hasConnectedRef.current = true;
      lastTokenRef.current = finalToken;
    } catch (error) {
      console.error("❌ Socket connection error:", error);
      hasConnectedRef.current = false;
      lastTokenRef.current = null;
    }

    return undefined;
  }, [token]);

  useEffect(() => {
    return () => {
      if (hasConnectedRef.current) {
        socketService.disconnect();
        hasConnectedRef.current = false;
        lastTokenRef.current = null;
      }
    };
  }, []);

  return (
    <ChatContext.Provider value={{ socketService }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
