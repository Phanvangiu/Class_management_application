import { useState } from "react";
import { FinishLesson, GetLessonsByStudent } from "../api/apiStudent";
import LoadingPage from "../../../shared/components/LoadingPage";
import styled from "styled-components";
import SuccessPopUp from "../../../shared/components/SuccessPopup";
import ErrorPopUp from "../../../shared/components/ErrorPopup";

const Container = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f3f4f6;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) =>
    props.status === "pending" ? "#fef3c7" : "#d1fae5"};
  color: ${(props) => (props.status === "pending" ? "#92400e" : "#065f46")};
`;

const ConfirmButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#9ca3af" : "#10b981")};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#9ca3af" : "#059669")};
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 32px;
  color: #6b7280;
`;

const ModalOverlay = styled.div`
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

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
`;

const ModalMessage = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.variant === "cancel"
      ? `
    background-color: #f3f4f6;
    color: #374151;
    &:hover {
      background-color: #e5e7eb;
    }
  `
      : `
    background-color: #10b981;
    color: white;
    &:hover {
      background-color: #059669;
    }
  `}
`;

export default function StudentLessonPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLessonCode, setSelectedLessonCode] = useState(null);

  const getLesson = GetLessonsByStudent();
  const finishLessonMutation = FinishLesson();

  if (getLesson.isLoading) {
    return <LoadingPage />;
  }

  const lessons = getLesson.data?.data || [];

  const sortedLessons = [...lessons].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return 0;
  });

  const handleConfirmClick = (lessonCode) => {
    setSelectedLessonCode(lessonCode);
    setShowConfirmModal(true);
  };

  const handleConfirmComplete = () => {
    finishLessonMutation.mutate(
      { lessonCode: selectedLessonCode },
      {
        onSuccess: (response) => {
          const businessStatus = response?.status;

          if (businessStatus === 201 || businessStatus === 200) {
            setShowConfirmModal(false);
            setSuccessMessage("Lesson completed successfully!");
            setIsSuccess(true);
            getLesson.refetch();
          } else {
            const errMsg =
              response?.message ||
              "An error occurred while completing the lesson";
            setShowConfirmModal(false);
            setErrorMessage(errMsg);
            setIsError(true);
          }
        },
        onError: (error) => {
          const errMsg =
            error?.response?.data?.message || "Không thể hoàn thành bài học";
          setShowConfirmModal(false);
          setErrorMessage(errMsg);
          setIsError(true);
        },
      },
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Container>
      <Title>Lesson list</Title>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader>Tilte</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Lesson Code</TableHeader>
              <TableHeader>Assigned By</TableHeader>
              <TableHeader>Created Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {sortedLessons.map((lesson, index) => (
              <TableRow key={lesson.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.description}</TableCell>
                <TableCell>{lesson.lessonCode}</TableCell>
                <TableCell>{lesson.assignedBy}</TableCell>
                <TableCell>{formatDate(lesson.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={lesson.status}>
                    {lesson.status === "pending" ? "Pending" : "Completed"}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ConfirmButton
                    disabled={lesson.status !== "pending"}
                    onClick={() => handleConfirmClick(lesson.lessonCode)}
                  >
                    {lesson.status === "pending"
                      ? "Confirm Completion"
                      : "Completed"}
                  </ConfirmButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      {lessons.length === 0 && (
        <EmptyMessage>No lessons have been assigned yet</EmptyMessage>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ModalOverlay onClick={() => setShowConfirmModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Confirm Completion</ModalTitle>
            <ModalMessage>
              Are you sure you want to mark this lesson as completed?
            </ModalMessage>
            <ModalActions>
              <ModalButton
                variant="cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton onClick={handleConfirmComplete}>Confirm</ModalButton>
            </ModalActions>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* SUCCESS POPUP */}
      {isSuccess && (
        <SuccessPopUp
          message={successMessage}
          action={() => {
            setIsSuccess(false);
            setSuccessMessage("");
            finishLessonMutation.reset();
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
            finishLessonMutation.reset();
          }}
        />
      )}
    </Container>
  );
}
