import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../shared/context/AuthContext";
import { GetStudents } from "../instructor/api/instructorApi";
import ChatWindow from "./ChatWindow";
import ChatUserList from "./ChatUserList";

const Container = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: #f0f2f5;
  overflow: hidden;
`;

const Placeholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

const PlaceholderContent = styled.div`
  text-align: center;
  color: #65676b;

  h2 {
    margin: 0 0 12px 0;
    font-size: 28px;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 16px;
    opacity: 0.7;
  }
`;

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: studentsData, isLoading } = GetStudents(1, 20);
  const students = studentsData?.data.students || [];

  return (
    <Container>
      <ChatUserList
        users={students}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        isLoading={isLoading}
      />

      {selectedUser ? (
        <ChatWindow otherUser={selectedUser} currentUser={user} />
      ) : (
        <Placeholder>
          <PlaceholderContent>
            <h2>💬 Select a user to start chatting</h2>
            <p>Choose someone from the list on the left</p>
          </PlaceholderContent>
        </Placeholder>
      )}
    </Container>
  );
}
