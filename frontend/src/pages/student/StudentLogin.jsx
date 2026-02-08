import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAuth } from "../../shared/context/AuthContext";
import OTPModal from "../../shared/components/OTPModal";
import { useStudentLogin, useStudentVerifyOTP } from "../../shared/api/apiAuth";

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
  background: #667eea;
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

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const studentLoginMutation = useStudentLogin();
  const studentVerifyOTPMutation = useStudentVerifyOTP();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/student", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  const onSubmit = (data) => {
    setUserEmail(data.email);

    studentLoginMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          console.log("Login success:", response);
          if (response.status === 200 && response.data) {
            setShowOTP(true);
          }
        },
        onError: (error) => {
          console.error("Login error:", error);
          const errorMessage =
            error.response?.data?.message || "Incorrect email or password";
          setError("email", { message: errorMessage });
        },
      },
    );
  };

  const handleOTPSubmit = (otpCode) => {
    studentVerifyOTPMutation.mutate(
      {
        target: userEmail,
        otp: otpCode,
      },
      {
        onSuccess: (response) => {
          console.log("OTP verify success:", response);
          if (response.status === 200 && response.data) {
            login(response.data.token, response.data.user);
            navigate("/student", { replace: true });
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
        <Title>Student Login Form</Title>
        <Subtitle>Enter your email and password to continue</Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              className={errors.email ? "error" : ""}
              {...register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className={errors.password ? "error" : ""}
              {...register("password", {
                required: "Please enter your password",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <SubmitButton type="submit" disabled={studentLoginMutation.isPending}>
            {studentLoginMutation.isPending ? "Processing..." : "Sign In"}
          </SubmitButton>
        </Form>

        <SwitchLink>
          Are you an instructor? <a href="/instructor/login">Sign in here</a>
        </SwitchLink>
      </LoginCard>

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onSubmit={handleOTPSubmit}
        loading={studentVerifyOTPMutation.isPending}
        error={studentVerifyOTPMutation.error?.response?.data?.message}
        contact={userEmail}
      />
    </Container>
  );
};

export default StudentLogin;
