import { Outlet, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #3498db;
  color: white;
  padding: 20px;
`;

const Logo = styled.h2`
  margin-bottom: 30px;
  color: white;
  font-size: 20px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;

  &:hover {
    background-color: #2980b9;
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

const UserName = styled.span`
  color: #2c3e50;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;

const Content = styled.div`
  padding: 30px;
  background-color: #ecf0f1;
  flex: 1;
`;

const StudentLayout = () => {
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
        <Logo>🎓 Student Portal</Logo>
        <Nav>
          <NavLink to="/student/lesson">📝 Lesson</NavLink>
          <NavLink to="/student/chat">💬 Chat</NavLink>
          <NavLink to="/student/profile">👥 Profile</NavLink>
        </Nav>
      </Sidebar>
      <MainContent>
        <Header>
          <HeaderTitle>Student Dashboard</HeaderTitle>
          <UserInfo>
            <UserName>{user.name} </UserName>
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

export default StudentLayout;
