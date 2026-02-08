import styled from "styled-components";

const Container = styled.div`
  width: 360px;
  background: white;
  border-right: 1px solid #e4e6eb;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e4e6eb;

  h3 {
    margin: 0 0 4px 0;
    font-size: 28px;
    font-weight: 700;
    color: #050505;
  }
`;

const UserCount = styled.span`
  font-size: 14px;
  color: #65676b;
`;

const UserListItems = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  background: ${(props) => (props.$active ? "#e7f3ff" : "white")};

  &:hover {
    background: ${(props) => (props.$active ? "#e7f3ff" : "#f2f2f2")};
  }
`;

const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 22px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  color: #050505;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.div`
  font-size: 13px;
  color: #65676b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Loading = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #65676b;
`;

const NoUsers = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #65676b;
`;

export default function ChatUserList({
  users,
  selectedUser,
  onSelectUser,
  isLoading,
}) {
  if (isLoading) {
    return (
      <Container>
        <Header>
          <h3>Messages</h3>
        </Header>
        <Loading>Loading...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h3>Messages</h3>

        <UserCount>{users.length} users</UserCount>
      </Header>

      <UserListItems>
        {users.length === 0 ? (
          <NoUsers>No users found</NoUsers>
        ) : (
          users.map((user) => (
            <UserItem
              key={user.userId}
              $active={selectedUser?.userId === user.userId}
              onClick={() => onSelectUser(user)}
            >
              <UserAvatar>
                {user.fullName?.charAt(0)?.toUpperCase() || "?"}
              </UserAvatar>
              <UserInfo>
                <UserName>{user.fullName || user.userId}</UserName>
                <UserEmail>{user.userId}</UserEmail>
              </UserInfo>
            </UserItem>
          ))
        )}
      </UserListItems>
    </Container>
  );
}
