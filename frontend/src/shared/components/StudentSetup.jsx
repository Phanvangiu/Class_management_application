import { useState, useEffect } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
`;

const Container = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  opacity: 0.9;
`;

const FormContainer = styled.div`
  padding: 40px 30px;
  display: ${(props) => (props.$show ? "block" : "none")};

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
`;

const Required = styled.span`
  color: #ef4444;
`;

const Optional = styled.span`
  color: #94a3b8;
  font-weight: 400;
  font-size: 13px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid
    ${(props) =>
      props.$error ? "#ef4444" : props.$success ? "#10b981" : "#e2e8f0"};
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$error ? "#ef4444" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$error ? "rgba(239, 68, 68, 0.1)" : "rgba(102, 126, 234, 0.1)"};
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #64748b;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #334155;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
  display: ${(props) => (props.$show ? "block" : "none")};
`;

const PasswordStrengthContainer = styled.div`
  margin-top: 8px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
`;

const PasswordStrengthBar = styled.div`
  height: 100%;
  width: ${(props) =>
    props.$strength === "weak"
      ? "33%"
      : props.$strength === "medium"
        ? "66%"
        : props.$strength === "strong"
          ? "100%"
          : "0%"};
  background: ${(props) =>
    props.$strength === "weak"
      ? "#ef4444"
      : props.$strength === "medium"
        ? "#f59e0b"
        : props.$strength === "strong"
          ? "#10b981"
          : "transparent"};
  transition: all 0.3s ease;
  border-radius: 2px;
`;

const PasswordRequirements = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
`;

const RequirementsList = styled.ul`
  list-style: none;
  margin-top: 8px;
`;

const RequirementItem = styled.li`
  padding: 4px 0;
  color: ${(props) => (props.$valid ? "#10b981" : "#64748b")};

  &::before {
    content: ${(props) => (props.$valid ? '"✓"' : '"○"')};
    margin-right: 8px;
    font-weight: ${(props) => (props.$valid ? "bold" : "normal")};
    color: ${(props) => (props.$valid ? "#10b981" : "inherit")};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: ${(props) => (props.$show ? "block" : "none")};
  text-align: center;
  padding: 40px 30px;
`;

const Spinner = styled.div`
  border: 3px solid #f3f4f6;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: #64748b;
`;

const SuccessContainer = styled.div`
  display: ${(props) => (props.$show ? "block" : "none")};
  text-align: center;
  padding: 40px 30px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  color: white;
`;

const SuccessTitle = styled.h2`
  color: #1e293b;
  margin-bottom: 8px;
`;

const SuccessText = styled.p`
  color: #64748b;
  margin-bottom: ${(props) => props.$marginBottom || "0"};
  font-size: ${(props) => (props.$small ? "14px" : "inherit")};
`;

const StudentSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Invalid setup link. Please contact your instructor.");
      navigate("/");
    }
  }, [token, navigate]);

  const checkPasswordRequirements = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const requirements = checkPasswordRequirements(formData.password);

  useEffect(() => {
    const validCount = Object.values(requirements).filter(Boolean).length;
    if (validCount <= 2) setPasswordStrength("weak");
    else if (validCount <= 4) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [formData.password]);

  const validators = {
    password: (value) => {
      if (!value || value.trim() === "") {
        return "Password is required";
      }
      const reqs = checkPasswordRequirements(value);
      return Object.values(reqs).every(Boolean)
        ? ""
        : "Password does not meet requirements";
    },
    confirmPassword: (value) => {
      if (!value || value.trim() === "") {
        return "Please confirm your password";
      }
      return value === formData.password ? "" : "Passwords do not match";
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name] && validators[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validators[name](value),
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validators[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validators[name](formData[name]),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      const error = validators[field](formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        password: formData.password,
      };

      if (formData.name.trim()) {
        submitData.name = formData.name.trim();
      }
      if (formData.phone.trim()) {
        submitData.phone = formData.phone.trim();
      }
      if (formData.address.trim()) {
        submitData.address = formData.address.trim();
      }

      const response = await fetch(
        "http://localhost:3001/api/user/setup_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submitData: submitData,
            tokenSetup: token,
          }),
        },
      );

      const result = await response.json();

      if (result.status === 200 || result.status === 201) {
        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
          Cookies.remove("CLIENT_ACCESS_TOKEN");

          navigate("/student/login");
        }, 3000);
      } else {
        throw new Error(result.message || "Setup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.message ||
          "An error occurred during setup. Please try again or contact support.",
      );
      setLoading(false);
    }
  };

  const getInputState = (field) => {
    if (!touched[field]) return {};
    return {
      $error: !!errors[field],
      $success: !errors[field] && formData[field],
    };
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title>Welcome! 👋</Title>
          <Subtitle>Complete your account setup to get started</Subtitle>
        </Header>

        <FormContainer $show={!loading && !success}>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">
                Full Name <Optional>(optional)</Optional>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">
                Phone Number <Optional>(optional)</Optional>
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">
                Address <Optional>(optional)</Optional>
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                onBlur={() => handleBlur("address")}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">
                Password <Required>*</Required>
              </Label>
              <PasswordWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  {...getInputState("password")}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </TogglePasswordButton>
              </PasswordWrapper>
              <PasswordStrengthContainer>
                <PasswordStrengthBar $strength={passwordStrength} />
              </PasswordStrengthContainer>
              <PasswordRequirements>
                <strong>Password must contain:</strong>
                <RequirementsList>
                  <RequirementItem $valid={requirements.length}>
                    At least 8 characters
                  </RequirementItem>
                  <RequirementItem $valid={requirements.uppercase}>
                    One uppercase letter
                  </RequirementItem>
                  <RequirementItem $valid={requirements.lowercase}>
                    One lowercase letter
                  </RequirementItem>
                  <RequirementItem $valid={requirements.number}>
                    One number
                  </RequirementItem>
                  <RequirementItem $valid={requirements.special}>
                    One special character
                  </RequirementItem>
                </RequirementsList>
              </PasswordRequirements>
              <ErrorMessage $show={touched.password && errors.password}>
                {errors.password}
              </ErrorMessage>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">
                Confirm Password <Required>*</Required>
              </Label>
              <PasswordWrapper>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  {...getInputState("confirmPassword")}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </TogglePasswordButton>
              </PasswordWrapper>
              <ErrorMessage
                $show={touched.confirmPassword && errors.confirmPassword}
              >
                {errors.confirmPassword}
              </ErrorMessage>
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              Complete Setup
            </SubmitButton>
          </Form>
        </FormContainer>

        <LoadingContainer $show={loading}>
          <Spinner />
          <LoadingText>Setting up your account...</LoadingText>
        </LoadingContainer>

        <SuccessContainer $show={success}>
          <SuccessIcon>✓</SuccessIcon>
          <SuccessTitle>Account Setup Complete!</SuccessTitle>
          <SuccessText $marginBottom="24px">
            Your account has been successfully created.
          </SuccessText>
          <SuccessText $small>Redirecting to login page...</SuccessText>
        </SuccessContainer>
      </Container>
    </PageWrapper>
  );
};

export default StudentSetup;
