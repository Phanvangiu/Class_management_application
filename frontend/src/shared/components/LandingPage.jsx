import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0);
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const LoginButton = styled.button`
  padding: 18px 30px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const StudentButton = styled(LoginButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background: blue;
  color: white;
`;

const InstructorButton = styled(LoginButton)`
  background: #f5576c;
  color: white;
`;

const Icon = styled.span`
  font-size: 24px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #bdc3c7;
  font-size: 16px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ecf0f1;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const Footer = styled.div`
  margin-top: 40px;
  color: #95a5a6;
  font-size: 14px;
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const redirectPath =
        user.role === "instructor" ? "/instructor" : "/student";
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate]);
  console.log("shdsfbkeghglslkg");
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
        <Logo>🎓</Logo>
        <Title>Classroom Management</Title>
        <Subtitle>
          Modern Classroom Management System
          <br />
          Choose your role to sign in
        </Subtitle>

        <ButtonGroup>
          <StudentButton onClick={() => navigate("/student/login")}>
            <Icon>👨‍🎓</Icon>
            Sign in as Student
          </StudentButton>

          <Divider>or</Divider>

          <InstructorButton onClick={() => navigate("/instructor/login")}>
            <Icon>👨‍🏫</Icon>
            Sign in as Instructor
          </InstructorButton>
        </ButtonGroup>

        <Footer>© 2024 Classroom Management System</Footer>
      </Card>
    </Container>
  );
};

export default LandingPage;
