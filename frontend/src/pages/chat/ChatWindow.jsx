import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useChat } from "../../shared/context/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e4e6eb;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
`;

const HeaderUser = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-right: 12px;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const HeaderName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #050505;
`;

const HeaderStatus = styled.div`
  font-size: 13px;
  color: #0084ff;
  min-height: 18px;
  margin-top: 2px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f0f2f5;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

const LoadingRoom = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #65676b;
`;

export default function ChatWindow({ otherUser, currentUser }) {
  const { socketService } = useChat();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [roomJoined, setRoomJoined] = useState(false);
  const messagesEndRef = useRef(null);

  const otherUserId = otherUser.userId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const cleanupHistory = socketService.onChatHistory((data) => {
      setMessages(data.messages);
    });

    const cleanupNewMessage = socketService.onNewMessage((msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) {
          return prev;
        }
        return [...prev, msg];
      });
    });

    const cleanupTyping = socketService.onUserTyping((data) => {
      if (data.userId === otherUserId) {
        setIsTyping(true);
      }
    });

    const cleanupStopTyping = socketService.onUserStopTyping((data) => {
      if (data.userId === otherUserId) {
        setIsTyping(false);
      }
    });

    socketService.joinRoom(otherUserId, () => {
      setRoomJoined(true);
    });

    return () => {
      socketService.leaveRoom(otherUserId);
      cleanupHistory();
      cleanupNewMessage();
      cleanupTyping();
      cleanupStopTyping();
      setRoomJoined(false);
      setMessages([]);
      setIsTyping(false);
    };
  }, [otherUserId, socketService]);

  const handleSendMessage = (text) => {
    if (!text.trim() || !roomJoined) {
      return;
    }

    socketService.sendMessage({
      to: otherUserId,
      message: text.trim(),
    });
  };

  const handleTyping = () => {
    socketService.startTyping(otherUserId);
  };

  const handleStopTyping = () => {
    socketService.stopTyping(otherUserId);
  };

  return (
    <Container>
      <Header>
        <HeaderUser>
          <HeaderAvatar>
            {otherUser.fullName?.charAt(0)?.toUpperCase() || "?"}
          </HeaderAvatar>
          <HeaderInfo>
            <HeaderName>{otherUser.fullName || otherUserId}</HeaderName>
            <HeaderStatus>{isTyping ? "đang gõ..." : ""}</HeaderStatus>
          </HeaderInfo>
        </HeaderUser>
      </Header>

      <MessagesContainer>
        {!roomJoined && <LoadingRoom>🔄 Joining chat...</LoadingRoom>}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwn={msg.from === currentUser.userId}
          />
        ))}

        {isTyping && (
          <div style={{ padding: "8px", color: "#999", fontSize: "13px" }}>
            {otherUser.fullName || otherUserId} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <ChatInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        disabled={!roomJoined}
      />
    </Container>
  );
}
