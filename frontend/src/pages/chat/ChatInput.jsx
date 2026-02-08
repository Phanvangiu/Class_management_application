import { useState, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e4e6eb;
  gap: 12px;
`;

const TextArea = styled.textarea`
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 15px;
  resize: none;
  max-height: 120px;
  font-family: inherit;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: #0084ff;
  }

  &:disabled {
    background: #f0f0f0;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.disabled ? "#ccc" : "#0084ff")};
  color: white;
  font-size: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #0073e6;
  }
`;

export default function ChatInput({
  onSend,
  onTyping,
  onStopTyping,
  disabled,
}) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);

    onTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleSend = () => {
    if (!text.trim()) return;

    onStopTyping();
    onSend(text);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container>
      <TextArea
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? "Đang kết nối..." : "Nhập tin nhắn..."}
        disabled={disabled}
        rows={1}
      />
      <SendButton onClick={handleSend} disabled={disabled || !text.trim()}>
        📤
      </SendButton>
    </Container>
  );
}
