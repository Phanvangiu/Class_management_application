import { useState } from "react";
import styled from "styled-components";
import { FiX, FiSearch } from "react-icons/fi";
import { GetStudents } from "../api/instructorApi";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 20px 20px 0 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
  color: #86868b;

  &:hover {
    background: #f5f5f7;
  }

  svg {
    font-size: 20px;
  }
`;

const Form = styled.form`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e7;
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  &::placeholder {
    color: #86868b;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e7;
  border-radius: 12px;
  font-size: 15px;
  color: #1d1d1f;
  transition: all 0.2s ease;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  &::placeholder {
    color: #86868b;
  }
`;

const StudentSelectionSection = styled.div`
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #86868b;
  font-size: 16px;
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  padding-left: 44px;
`;

const SelectAllWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f7;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e5e5e7;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0071e3;
`;

const SelectAllLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  cursor: pointer;
  flex: 1;
`;

const StudentCount = styled.span`
  font-size: 13px;
  color: #86868b;
`;

const StudentList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e5e7;
  border-radius: 12px;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f7;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a6;
  }
`;

const StudentItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f7;
  }
`;

const StudentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StudentName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StudentEmail = styled.div`
  font-size: 13px;
  color: #86868b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #86868b;
  font-size: 14px;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 20px;
  color: #86868b;
  font-size: 14px;
`;

const ErrorText = styled.span`
  display: block;
  color: #ff3b30;
  font-size: 13px;
  margin-top: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f7;
  color: #1d1d1f;

  &:hover:not(:disabled) {
    background: #e5e5e7;
  }
`;

const SubmitButton = styled(Button)`
  background: #0071e3;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.2);

  &:hover:not(:disabled) {
    background: #0077ed;
    box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const AddLessonModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});

  const { data: studentsData } = GetStudents(1, 1000);

  const students = studentsData?.data?.students || [];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      const allEmails = new Set(filteredStudents.map((s) => s.email));
      setSelectedStudents(allEmails);
    }
  };

  const handleToggleStudent = (email) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(email)) {
        newSet.delete(email);
      } else {
        newSet.add(email);
      }
      return newSet;
    });

    if (errors.students) {
      setErrors((prev) => ({
        ...prev,
        students: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (selectedStudents.size === 0) {
      newErrors.students = "Please select at least one student";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: formData.title,
      description: formData.description,
      studentIds: Array.from(selectedStudents),
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
    });
    setSelectedStudents(new Set());
    setSearchQuery("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isAllSelected =
    filteredStudents.length > 0 &&
    selectedStudents.size === filteredStudents.length;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Create New Lesson</Title>
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              Title <span style={{ color: "#ff3b30" }}>*</span>
            </Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter lesson title"
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>
              Description <span style={{ color: "#ff3b30" }}>*</span>
            </Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter lesson description"
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </FormGroup>

          <StudentSelectionSection>
            <Label>
              Select Students <span style={{ color: "#ff3b30" }}>*</span>
            </Label>

            <SearchWrapper>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchWrapper>

            {isLoading ? (
              <LoadingText>Loading students...</LoadingText>
            ) : (
              <>
                <SelectAllWrapper onClick={handleSelectAll}>
                  <Checkbox
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                  <SelectAllLabel>Select All</SelectAllLabel>
                  <StudentCount>
                    {selectedStudents.size} / {filteredStudents.length} selected
                  </StudentCount>
                </SelectAllWrapper>

                <StudentList>
                  {filteredStudents.length === 0 ? (
                    <EmptyText>
                      {searchQuery
                        ? "No students found"
                        : "No students available"}
                    </EmptyText>
                  ) : (
                    filteredStudents.map((student) => (
                      <StudentItem key={student.email}>
                        <Checkbox
                          type="checkbox"
                          checked={selectedStudents.has(student.email)}
                          onChange={() => handleToggleStudent(student.email)}
                        />
                        <StudentInfo>
                          <StudentName>{student.name}</StudentName>
                          <StudentEmail>{student.email}</StudentEmail>
                        </StudentInfo>
                      </StudentItem>
                    ))
                  )}
                </StudentList>
              </>
            )}

            {errors.students && <ErrorText>{errors.students}</ErrorText>}
          </StudentSelectionSection>

          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Lesson"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default AddLessonModal;
