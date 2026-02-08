import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  useInstructorLogin,
  useInstructorVerifyOTP,
} from "../../shared/api/apiAuth";
import { useAuth } from "../../shared/context/AuthContext";
import OTPModal from "../../shared/components/OTPModal";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #667eea;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 14px;
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &.error {
    border-color: #e74c3c;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SwitchLink = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 14px;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const InstructorLogin = () => {
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const instructorLoginMutation = useInstructorLogin();
  const instructorVerifyOTPMutation = useInstructorVerifyOTP();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  useEffect(() => {
    if (!loading && user) {
      navigate("/instructor", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Container>
        <LoginCard>
          <Title>Loading...</Title>
        </LoginCard>
      </Container>
    );
  }

  if (user) {
    return null;
  }

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = "84" + cleaned.substring(1);
    }

    if (!cleaned.startsWith("84")) {
      cleaned = "84" + cleaned;
    }

    return "+" + cleaned;
  };

  const onSubmit = (data) => {
    const formattedPhone = formatPhoneNumber(data.phone);
    setPhoneNumber(formattedPhone);

    instructorLoginMutation.mutate(
      {
        phone: formattedPhone,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200 && response.data) {
            setShowOTP(true);
          } else {
            setError("phone", {
              message: response.message || "Login failed",
            });
          }
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.message || "Login failed";
          setError("phone", { message: errorMessage });
        },
      },
    );
  };

  const handleOTPSubmit = (otpCode) => {
    instructorVerifyOTPMutation.mutate(
      {
        target: phoneNumber,
        otp: otpCode,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200 && response.data) {
            login(response.data.token, response.data.user);
            navigate("/instructor", { replace: true });
          }
        },
        onError: (error) => {
          console.error("OTP verify error:", error);
        },
      },
    );
  };

  return (
    <Container>
      <LoginCard>
        <Title>Instructor Login Form</Title>
        <Subtitle>Enter your phone number to continue</Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="0123456789"
              className={errors.phone ? "error" : ""}
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^(0|\+84)[0-9]{9}$/,
                  message: "Số điện thoại không hợp lệ (10 số)",
                },
              })}
            />
            {errors.phone && (
              <ErrorMessage>{errors.phone.message}</ErrorMessage>
            )}
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={instructorLoginMutation.isPending}
          >
            {instructorLoginMutation.isPending ? "Đang xử lý..." : "Continue"}
          </SubmitButton>
        </Form>

        <SwitchLink>
          Are you a student? <a href="/student/login">Sign in here</a>
        </SwitchLink>
      </LoginCard>

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onSubmit={handleOTPSubmit}
        loading={instructorVerifyOTPMutation.isPending}
        error={instructorVerifyOTPMutation.error?.response?.data?.message}
        contact={phoneNumber}
      />
    </Container>
  );
};

export default InstructorLogin;
