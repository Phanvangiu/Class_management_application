import styled from "styled-components";
import { FiAlertTriangle } from "react-icons/fi";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Dialog = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff3cd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    font-size: 28px;
    color: #ff3b30;
  }
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 12px 0;
  text-align: center;
`;

const Message = styled.p`
  font-size: 15px;
  color: #86868b;
  margin: 0 0 24px 0;
  text-align: center;
  line-height: 1.5;
`;

const StudentInfo = styled.div`
  background: #f5f5f7;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;

  p {
    margin: 0;
    font-size: 14px;
    color: #1d1d1f;
    line-height: 1.6;

    strong {
      font-weight: 600;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f7;
  color: #1d1d1f;

  &:hover {
    background: #e5e5e7;
  }
`;

const DeleteButton = styled(Button)`
  background: #ff3b30;
  color: white;

  &:hover {
    background: #ff453a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  student,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          <FiAlertTriangle />
        </IconWrapper>

        <Title>Delete Student?</Title>
        <Message>
          This action cannot be undone. Are you sure you want to delete this
          student?
        </Message>

        {student && (
          <StudentInfo>
            <p>
              <strong>Name:</strong> {student.name}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Phone:</strong> {student.phone}
            </p>
          </StudentInfo>
        )}

        <ButtonGroup>
          <CancelButton onClick={onClose} disabled={isLoading}>
            Cancel
          </CancelButton>
          <DeleteButton onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </DeleteButton>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
}
