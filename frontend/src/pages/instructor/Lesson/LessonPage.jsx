import { GetLessons, GetLessonStudents, AddLesson } from "../api/instructorApi";
import LoadingPage from "../../../shared/components/LoadingPage";
import styled from "styled-components";
import { useState } from "react";
import AddLessonModal from "./AddLessonModal";
import SuccessPopUp from "../../../shared/components/SuccessPopup";
import ErrorPopUp from "../../../shared/components/ErrorPopup";

const Container = styled.div`
  padding: 40px;
  background: #f5f5f7;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: #1d1d1f;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CreateButton = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.2);
  white-space: nowrap;

  &:hover {
    background: #0077ed;
    box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: visible;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 20px 20px 0 0;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f7;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a6;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    text-align: left;
    font-size: 12px;
    color: #86868b;
    font-weight: 600;
    padding: 16px 24px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  td {
    padding: 20px 24px;
    border-bottom: 1px solid #f5f5f7;
    font-size: 15px;
    color: #1d1d1f;
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: #fafafa;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const TableRow = styled.tr``;

const TableHeader = styled.th``;

const TableBody = styled.tbody``;

const TableCell = styled.td``;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 980px;
  font-size: 13px;
  font-weight: 500;
  background: ${(props) =>
    props.status === "pending" ? "#fff3cd" : "#d1f4e0"};
  color: ${(props) => (props.status === "pending" ? "#856404" : "#0f5132")};
  display: inline-block;
  white-space: nowrap;
`;

const Button = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 980px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.2);

  &:hover {
    background: #0077ed;
    box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: #86868b;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 15px;
    margin: 0;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
`;

const PopupTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const LoadingPopup = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const TotalInfo = styled.div`
  margin-bottom: 16px;
  color: #6b7280;
  font-size: 14px;
`;

export default function LessonPage() {
  const [selectedLessonCode, setSelectedLessonCode] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addLessonMutation = AddLesson();
  const { data, isLoading, refetch } = GetLessons();

  if (isLoading) {
    return <LoadingPage />;
  }

  const lessons = data?.data || [];

  const handleShowStudents = (lessonCode) => {
    setSelectedLessonCode(lessonCode);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedLessonCode(null);
  };

  const handleAddLesson = (formData) => {
    const payload = {
      lesson: {
        title: formData.title,
        description: formData.description,
      },
      studentIds: formData.studentIds,
    };

    addLessonMutation.mutate(payload, {
      onSuccess: (response) => {
        const businessStatus = response?.status;

        if (businessStatus === 200) {
          setIsAddModalOpen(false);
          setSuccessMessage(
            response?.message || "Lesson created successfully!",
          );
          setIsSuccess(true);
          refetch(); // Refresh lesson list
        } else {
          const errMsg =
            response?.message || "An error occurred while creating lesson";
          setErrorMessage(errMsg);
          setIsError(true);
        }
      },
      onError: (error) => {
        const errMsg =
          error?.response?.data?.message || "Failed to create lesson";
        setErrorMessage(errMsg);
        setIsError(true);
      },
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Container>
      <Header>
        <TopRow>
          <Title>Lesson List</Title>
          <CreateButton onClick={() => setIsAddModalOpen(true)}>
            + Create Lesson
          </CreateButton>
        </TopRow>
      </Header>

      <Card>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>No.</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Lesson Code</TableHeader>
                <TableHeader>Created Date</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <TableBody>
              {lessons.length === 0 ? (
                <tr>
                  <TableCell colSpan="6">
                    <EmptyMessage>
                      <h3>No lessons</h3>
                      <p>Create your first lesson</p>
                    </EmptyMessage>
                  </TableCell>
                </tr>
              ) : (
                lessons.map((lesson, index) => (
                  <TableRow key={lesson.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{lesson.title}</TableCell>
                    <TableCell>{lesson.description}</TableCell>
                    <TableCell>{lesson.lessonCode}</TableCell>
                    <TableCell>{formatDate(lesson.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleShowStudents(lesson.lessonCode)}
                      >
                        Student List
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      </Card>

      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLesson}
        isLoading={addLessonMutation.isPending}
      />

      {/* STUDENT LIST POPUP */}
      {isPopupOpen && (
        <StudentListPopup
          lessonCode={selectedLessonCode}
          onClose={handleClosePopup}
        />
      )}

      {isSuccess && (
        <SuccessPopUp
          message={successMessage}
          action={() => {
            setIsSuccess(false);
            setSuccessMessage("");
            addLessonMutation.reset();
          }}
        />
      )}

      {/* ERROR POPUP */}
      {isError && (
        <ErrorPopUp
          message={errorMessage}
          action={() => {
            setIsError(false);
            setErrorMessage("");
            addLessonMutation.reset();
          }}
        />
      )}
    </Container>
  );
}

function StudentListPopup({ lessonCode, onClose }) {
  const studentData = GetLessonStudents(lessonCode);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp._seconds * 1000);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        <PopupHeader>
          <PopupTitle>Student List - Code: {lessonCode}</PopupTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </PopupHeader>

        {studentData.isLoading ? (
          <LoadingPopup>Loading...</LoadingPopup>
        ) : (
          <>
            {studentData.data?.data && studentData.data.data.length > 0 ? (
              <>
                <TotalInfo>{studentData.data.message}</TotalInfo>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <TableHeader>No.</TableHeader>
                        <TableHeader>Title</TableHeader>
                        <TableHeader>Student Email</TableHeader>
                        <TableHeader>Assigned By</TableHeader>
                        <TableHeader>Description</TableHeader>
                        <TableHeader>Created Date</TableHeader>
                        <TableHeader>Status</TableHeader>
                      </tr>
                    </thead>
                    <TableBody>
                      {studentData.data.data.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{student.title}</TableCell>
                          <TableCell>{student.assignedTo}</TableCell>
                          <TableCell>{student.assignedBy}</TableCell>
                          <TableCell>{student.description}</TableCell>
                          <TableCell>{formatDate(student.createdAt)}</TableCell>
                          <TableCell>
                            <StatusBadge status={student.status}>
                              {student.status === "pending"
                                ? "Pending"
                                : student.status}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableWrapper>
              </>
            ) : (
              <EmptyMessage>
                <h3>No students</h3>
                <p>No students assigned to this lesson</p>
              </EmptyMessage>
            )}
          </>
        )}
      </PopupContainer>
    </PopupOverlay>
  );
}
