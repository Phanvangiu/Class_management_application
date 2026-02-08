import { useState } from "react";
import styled from "styled-components";
import {
  CreateStudent,
  DeleteStudent,
  GetStudentById,
  GetStudents,
  UpdateStudent,
} from "./api/instructorApi";
import Pagination from "../../shared/components/Pagination";
import SelectInput from "../../shared/components/SelectInput";
import LoadingPage from "../../shared/components/LoadingPage";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import SuccessPopUp from "../../shared/components/SuccessPopup";
import { toast } from "react-toastify";
import ErrorPopUp from "../../shared/components/ErrorPopup";

const Page = styled.div`
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

const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: #1d1d1f;
  letter-spacing: -0.5px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #86868b;
  font-size: 18px;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #e5e5e7;
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  &::placeholder {
    color: #86868b;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  z-index: 100;
  min-width: 140px;

  @media (max-width: 768px) {
    width: 100%;
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

const TableContainer = styled.div`
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

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 980px;
  font-size: 13px;
  font-weight: 500;
  background: ${(p) => (p.active ? "#d1f4e0" : "#fff3cd")};
  color: ${(p) => (p.active ? "#0f5132" : "#856404")};
  display: inline-block;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e5e5e7;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${(p) => (p.danger ? "#ff3b30" : "#1d1d1f")};

  &:hover {
    background: ${(p) => (p.danger ? "#fff5f5" : "#f5f5f7")};
    border-color: ${(p) => (p.danger ? "#ff3b30" : "#d1d1d6")};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 16px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 24px;
  background: white;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 20px 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const EmptyState = styled.div`
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

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

export default function Students() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(optionsPage[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const createStudentMutation = CreateStudent();
  const updateStudentMutation = UpdateStudent();
  const deleteStudentMutation = DeleteStudent();
  const { data, isLoading, refetch } = GetStudents(currentPage, pageSize.value);

  const { data: studentDetailData, isLoading: isLoadingStudent } =
    GetStudentById(selectedStudentId);

  const students = data?.data?.students || [];
  const totalItems = data?.data?.total || 0;
  const totalPage = Math.ceil(totalItems / pageSize.value);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedStudent =
    studentDetailData?.data?.student || studentDetailData?.data;

  const validateStudentForm = (formData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email is not in correct format");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be 10 digits long");
      return false;
    }

    return true;
  };

  const formatPhoneToServer = (phone) => {
    return "+84" + phone.substring(1);
  };

  const handleAddStudent = (formData) => {
    if (!validateStudentForm(formData)) return;

    const formattedPhone = formatPhoneToServer(formData.phone);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("phone", formattedPhone);
    submitData.append("email", formData.email);
    submitData.append("address", formData.address);

    createStudentMutation.mutate(submitData, {
      onSuccess: (response) => {
        const businessStatus = response?.status;

        if (businessStatus === 201 || businessStatus === 200) {
          setIsModalOpen(false);
          setSuccessMessage("Student created successfully!");
          setIsSuccess(true);
          refetch();
          setCurrentPage(1);
        } else {
          const errMsg =
            response?.message || "An error occurred while creating student";
          setErrorMessage(errMsg);
          setIsError(true);
        }
      },
      onError: (error) => {
        const errMsg =
          error?.response?.data?.message || "Failed to create student";
        setErrorMessage(errMsg);
        setIsError(true);
      },
    });
  };

  const handleEditClick = (studentId) => {
    setSelectedStudentId(studentId);
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = (formData) => {
    if (!validateStudentForm(formData)) return;

    const formattedPhone = formatPhoneToServer(formData.phone);

    const submitData = {
      userId: selectedStudentId,
      name: formData.name,
      phone: formattedPhone,
      email: formData.email,
      address: formData.address,
    };

    updateStudentMutation.mutate(submitData, {
      onSuccess: (response) => {
        const businessStatus = response?.status;

        if (businessStatus === 200 || businessStatus === 201) {
          setIsEditModalOpen(false);
          setSelectedStudentId(null);
          setSuccessMessage("Student updated successfully!");
          setIsSuccess(true);
          refetch();
        } else {
          const errMsg =
            response?.message || "An error occurred while updating student";
          setErrorMessage(errMsg);
          setIsError(true);
        }
      },
      onError: (error) => {
        const errMsg =
          error?.response?.data?.message || "Failed to update student";
        setErrorMessage(errMsg);
        setIsError(true);
      },
    });
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;

    deleteStudentMutation.mutate(
      { studentId: studentToDelete.userId },
      {
        onSuccess: (response) => {
          const businessStatus = response?.status;

          if (businessStatus === 200 || businessStatus === 201) {
            setIsDeleteDialogOpen(false);
            setStudentToDelete(null);
            setSuccessMessage("Student deleted successfully!");
            setIsSuccess(true);
            refetch();

            if (filteredStudents.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          } else {
            const errMsg =
              response?.message || "An error occurred while deleting student";
            setErrorMessage(errMsg);
            setIsError(true);
            setIsDeleteDialogOpen(false);
            setStudentToDelete(null);
          }
        },
        onError: (error) => {
          const errMsg =
            error?.response?.data?.message || "Failed to delete student";
          setErrorMessage(errMsg);
          setIsError(true);
          setIsDeleteDialogOpen(false);
          setStudentToDelete(null);
        },
      },
    );
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  if (isLoading) return <LoadingPage />;

  return (
    <Page>
      <Header>
        <TopRow>
          <Title>Students</Title>
        </TopRow>

        <ControlsRow>
          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <SelectWrapper>
            <SelectInput
              state={pageSize}
              setState={(v) => {
                setCurrentPage(1);
                setPageSize(v);
              }}
              options={optionsPage}
            />
          </SelectWrapper>

          <CreateButton onClick={() => setIsModalOpen(true)}>
            + Create Student
          </CreateButton>
        </ControlsRow>
      </Header>

      <Card>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <EmptyState>
                      <h3>No students</h3>
                      <p>Create your first student</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id || s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>
                      <Status active={s.accountSetupCompleted}>
                        {s.accountSetupCompleted ? "Verified" : "Unverified"}
                      </Status>
                    </td>
                    <td>
                      <Actions>
                        <ActionButton onClick={() => handleEditClick(s.userId)}>
                          <FiEdit2 />
                        </ActionButton>
                        <ActionButton
                          danger
                          onClick={() => handleDeleteClick(s)}
                        >
                          <FiTrash2 />
                        </ActionButton>
                      </Actions>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>

        {students.length > 0 && (
          <Footer>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={totalPage}
            />
          </Footer>
        )}
      </Card>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
      />

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <>
          {isLoadingStudent ? (
            <LoadingPage />
          ) : selectedStudent ? (
            <EditStudentModal
              key={selectedStudentId}
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedStudentId(null);
              }}
              onSubmit={handleUpdateStudent}
              student={selectedStudent}
            />
          ) : null}
        </>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        student={studentToDelete}
        isLoading={deleteStudentMutation.isPending}
      />

      {isSuccess && (
        <SuccessPopUp
          message={successMessage}
          action={() => {
            setIsSuccess(false);
            setSuccessMessage("");
            createStudentMutation.reset();
            updateStudentMutation.reset();
            deleteStudentMutation.reset();
          }}
        />
      )}

      {isError && (
        <ErrorPopUp
          message={errorMessage}
          action={() => {
            setIsError(false);
            setErrorMessage("");
            createStudentMutation.reset();
            updateStudentMutation.reset();
            deleteStudentMutation.reset();
          }}
        />
      )}
    </Page>
  );
}
