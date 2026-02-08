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
  animation: slideUp 0.3s ease;

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
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
  color: #86868b;

  &:hover {
    background: #f5f5f7;
  }

  svg {
    font-size: 20px;
  }
`;

const Form = styled.form`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
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
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  &::placeholder {
    color: #86868b;
  }

  &:disabled {
    background: #f5f5f7;
    color: #86868b;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e7;
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  &::placeholder {
    color: #86868b;
  }
`;

const ErrorText = styled.span`
  display: block;
  color: #ff3b30;
  font-size: 13px;
  margin-top: 6px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f7;
  color: #1d1d1f;

  &:hover:not(:disabled) {
    background: #e5e5e7;
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
  }

  &:disabled {
    background: #d1d1d6;
    box-shadow: none;
  }
`;

const EditProfileModal = ({ isOpen, onClose, onSubmit, user, isLoading }) => {
  // Initialize formData based on user prop
  const getInitialFormData = () => {
    if (!user) {
      return {
        name: "",
        phone: "",
        address: "",
      };
    }

    // Format phone from +84 to 0
    const formattedPhone = user.phone?.startsWith("+84")
      ? "0" + user.phone.substring(3)
      : user.phone || "";

    return {
      name: user.name || "",
      phone: formattedPhone,
      address: user.address || "",
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});

  const isChanged = user
    ? formData.name !== (user.name || "") ||
      formData.phone !==
        (user.phone?.startsWith("+84")
          ? "0" + user.phone.substring(3)
          : user.phone || "") ||
      formData.address !== (user.address || "")
    : false;

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits and start with 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Edit Profile</Title>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email (Read-only)</Label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              placeholder="Email address"
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Name <span style={{ color: "#ff3b30" }}>*</span>
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>
              Phone Number <span style={{ color: "#ff3b30" }}>*</span>
            </Label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              maxLength={10}
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Address</Label>
            <TextArea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={!isChanged || isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default EditProfileModal;
