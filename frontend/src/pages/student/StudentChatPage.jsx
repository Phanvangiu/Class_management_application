import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../shared/context/AuthContext";
import ChatWindow from "../chat/ChatWindow";
import { GetInstructorById } from "./api/apiStudent";

const Container = styled.div`
  display: flex;
  height: calc(91vh - 70px);
  background: #f0f2f5;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: #65676b;

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0084ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  h2 {
    margin: 0 0 12px 0;
    font-size: 24px;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 15px;
    opacity: 0.7;
  }
`;

const ErrorContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

const ErrorContent = styled.div`
  text-align: center;
  color: #65676b;
  max-width: 400px;
  padding: 20px;

  .icon {
    font-size: 60px;
    margin-bottom: 16px;
  }

  h2 {
    margin: 0 0 12px 0;
    font-size: 24px;
    font-weight: 500;
    color: #f02849;
  }

  p {
    margin: 0;
    font-size: 15px;
    opacity: 0.7;
    line-height: 1.5;
  }
`;

export default function StudentChatPage() {
  const { user } = useAuth();
  const [instructor, setInstructor] = useState(null);

  const instructorId = user?.createdBy;

  const { data, isLoading, isError } = GetInstructorById(instructorId);

  console.log("📡 API State:", { isLoading, isError, hasData: !!data });

  useEffect(() => {
    if (data?.data) {
      setInstructor({
        userId: data.data.userId,
        fullName: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        role: data.data.role,
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingContent>
            <div className="spinner"></div>
            <h2>Loading instructor information...</h2>
            <p>Please wait a moment</p>
          </LoadingContent>
        </LoadingContainer>
      </Container>
    );
  }

  if (isError || !instructorId) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorContent>
            <div className="icon">⚠️</div>
            <h2>Instructor not found</h2>
            <p>
              {!instructorId
                ? "Your account is not linked to any instructor yet."
                : "Unable to load instructor information. Please try again later."}
            </p>
          </ErrorContent>
        </ErrorContainer>
      </Container>
    );
  }

  if (!instructor) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorContent>
            <div className="icon">👤</div>
            <h2>No instructor assigned</h2>
            <p>You have not been assigned an instructor yet.</p>
          </ErrorContent>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ChatWindow otherUser={instructor} currentUser={user} />
    </Container>
  );
}
