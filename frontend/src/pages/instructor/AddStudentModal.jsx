import { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: ${(p) => (p.isOpen ? "flex" : "none")};
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

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a6;
  }
`;

const ModalHeader = styled.div`
  padding: 28px 32px 20px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1;
`;

const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1d1d1f;
`;

const ModalBody = styled.div`
  padding: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 8px;

  span {
    color: #ff3b30;
    margin-left: 2px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${(p) => (p.error ? "#ff3b30" : "#d1d1d6")};
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  background: ${(p) => (p.error ? "#fff5f5" : "white")};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(p) => (p.error ? "#ff3b30" : "#0071e3")};
    box-shadow: 0 0 0 4px
      ${(p) => (p.error ? "rgba(255, 59, 48, 0.1)" : "rgba(0, 113, 227, 0.1)")};
  }

  &::placeholder {
    color: #86868b;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${(p) => (p.error ? "#ff3b30" : "#d1d1d6")};
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  background: ${(p) => (p.error ? "#fff5f5" : "white")};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(p) => (p.error ? "#ff3b30" : "#0071e3")};
    box-shadow: 0 0 0 4px
      ${(p) => (p.error ? "rgba(255, 59, 48, 0.1)" : "rgba(0, 113, 227, 0.1)")};
  }

  &::placeholder {
    color: #86868b;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  color: #ff3b30;
  font-size: 13px;
  margin-top: 6px;
`;

const ModalFooter = styled.div`
  padding: 20px 32px 28px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
  background: white;
  border-radius: 0 0 20px 20px;
`;

const Button = styled.button`
  padding: 12px 28px;
  border-radius: 980px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f7;
  color: #1d1d1f;

  &:hover:not(:disabled) {
    background: #e8e8ed;
  }

  &:active:not(:disabled) {
    background: #d2d2d7;
  }
`;

const SubmitButton = styled(Button)`
  background: #0071e3;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.2);

  &:hover:not(:disabled) {
    background: #0077ed;
    box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.2);
  }
`;

export default function AddStudentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter student name";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter phone number";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Please enter address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setErrors({});
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <Modal>
        <ModalHeader>
          <ModalTitle>Create New Student</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>
                Full Name<span>*</span>
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student name"
                error={errors.name}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Phone Number<span>*</span>
              </Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                error={errors.phone}
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Email<span>*</span>
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                error={errors.email}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Address<span>*</span>
              </Label>
              <TextArea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                error={errors.address}
              />
              {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Student"}
            </SubmitButton>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>
  );
}
