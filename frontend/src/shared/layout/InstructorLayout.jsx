import { Outlet, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #34495e;
  color: white;
  padding: 20px;
`;

const Logo = styled.h2`
  margin-bottom: 30px;
  color: #ecf0f1;
  font-size: 20px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #2c3e50;
  }

  &.active {
    background-color: #2c3e50;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: white;
  padding: 20px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  color: #2c3e50;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UserDetails = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
`;

const UserRole = styled.div`
  color: #7f8c8d;
  font-size: 12px;
  text-transform: uppercase;
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  padding: 30px;
  background-color: #ecf0f1;
  flex: 1;
`;

const InstructorLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>📚 Instructor Portal</Logo>
        <Nav>
          <NavLink to="/instructor/lesson">📖 Lesson</NavLink>
          <NavLink to="/instructor/students">👥 Students</NavLink>
          <NavLink to="/instructor/chat">💬 Chat</NavLink>
        </Nav>
      </Sidebar>
      <MainContent>
        <Header>
          <HeaderTitle>Instructor Dashboard</HeaderTitle>
          <UserInfo>
            <UserDetails>
              <UserName>{user?.name || "Instructor"}</UserName>
              <UserRole>{user?.email || user?.phone || ""}</UserRole>
            </UserDetails>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserInfo>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default InstructorLayout;
