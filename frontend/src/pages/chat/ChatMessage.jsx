import styled from "styled-components";

const MessageWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
  justify-content: ${(props) => (props.$isOwn ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 8px 12px;
  border-radius: 18px;
  word-wrap: break-word;
  background: ${(props) => (props.$isOwn ? "#0084ff" : "#e4e6eb")};
  color: ${(props) => (props.$isOwn ? "white" : "#050505")};
`;

const MessageText = styled.div`
  margin-bottom: 4px;
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
  margin-top: 2px;
`;

export default function ChatMessage({ message, isOwn }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <MessageWrapper $isOwn={isOwn}>
      <MessageBubble $isOwn={isOwn}>
        <MessageText>{message.message}</MessageText>
        <MessageTime>{formatTime(message.createdAt)}</MessageTime>
      </MessageBubble>
    </MessageWrapper>
  );
}
