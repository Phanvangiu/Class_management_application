import { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #2c3e50;
  text-align: center;
`;

const Description = styled.p`
  margin-bottom: 25px;
  color: #7f8c8d;
  text-align: center;
  font-size: 14px;
`;

const OTPInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
`;

const OTPInput = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #3498db;
  color: white;

  &:hover:not(:disabled) {
    background-color: #2980b9;
  }
`;

const CancelButton = styled(Button)`
  background-color: #95a5a6;
  color: white;

  &:hover:not(:disabled) {
    background-color: #7f8c8d;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const OTPModal = ({ isOpen, onClose, onSubmit, loading, error, contact }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      onSubmit(otpCode);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 6) {
      newOtp.push("");
    }
    setOtp(newOtp);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Enter OTP Code</Title>
        <Description>The OTP code has been sent to {contact}</Description>

        <OTPInputContainer>
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
            />
          ))}
        </OTPInputContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <CancelButton onClick={onClose} disabled={loading}>
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying..." : "Confirm"}
          </SubmitButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default OTPModal;
