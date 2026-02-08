import { useState } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

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
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  padding: 24px 24px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1d1d1f;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1d1d1f;

  &:hover {
    background: #e5e5e7;
  }

  svg {
    font-size: 18px;
  }
`;

const Form = styled.form`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e7;
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  &::placeholder {
    color: #86868b;
  }
`;

const Footer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  ${(p) =>
    p.primary
      ? `
    background: #0071e3;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.2);
    
    &:hover:not(:disabled) {
      background: #0077ed;
      box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3);
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #d1d1d6;
      cursor: not-allowed;
      opacity: 0.6;
    }
  `
      : `
    background: #f5f5f7;
    color: #1d1d1f;
    
    &:hover {
      background: #e5e5e7;
    }
  `}

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export default function EditStudentModal({
  isOpen,
  onClose,
  onSubmit,
  student,
}) {
  const getInitialData = (studentData) => {
    if (!studentData) {
      return {
        name: "",
        email: "",
        phone: "",
        address: "",
      };
    }

    const phoneDisplay = studentData.phone?.startsWith("+84")
      ? "0" + studentData.phone.substring(3)
      : studentData.phone || "";

    return {
      name: studentData.name || "",
      email: studentData.email || "",
      phone: phoneDisplay,
      address: studentData.address || "",
    };
  };

  const [formData, setFormData] = useState(() => getInitialData(student));
  const [originalData] = useState(() => getInitialData(student));

  const hasChanges =
    formData.name !== originalData.name ||
    formData.email !== originalData.email ||
    formData.phone !== originalData.phone ||
    formData.address !== originalData.address;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasChanges) {
      onSubmit(formData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <Header>
          <Title>Edit Student</Title>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number *</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              required
              maxLength="10"
            />
          </FormGroup>

          <FormGroup>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </FormGroup>
        </Form>

        <Footer>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            primary
            onClick={handleSubmit}
            disabled={!hasChanges}
          >
            Update Student
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
}
