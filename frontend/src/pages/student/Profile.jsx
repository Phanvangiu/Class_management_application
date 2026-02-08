import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../shared/context/AuthContext";
import { UpdateProfile } from "./api/apiStudent";
import EditProfileModal from "./EditProfileModel";
import SuccessPopUp from "../../shared/components/SuccessPopup";
import ErrorPopUp from "../../shared/components/ErrorPopup";

const ProfileContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  font-weight: bold;
  margin-right: 20px;
`;

const HeaderInfo = styled.div`
  flex: 1;

  h2 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 28px;
  }

  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 14px;
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$role) {
      case "admin":
        return "#ff6b6b";
      case "teacher":
        return "#4ecdc4";
      case "student":
        return "#95a5a6";
      default:
        return "#95a5a6";
    }
  }};
  color: white;
  text-transform: capitalize;
`;

const InfoSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  color: #34495e;
  margin-bottom: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 6px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
  word-break: break-word;
`;

const EmptyValue = styled.span`
  color: #bdc3c7;
  font-style: italic;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  background: #fee;
  border-radius: 8px;
`;

const AccountStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  background: ${(props) => (props.$completed ? "#d4edda" : "#fff3cd")};
  color: ${(props) => (props.$completed ? "#155724" : "#856404")};
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;

  &::before {
    content: ${(props) => (props.$completed ? '"✓"' : '"⚠"')};
    font-size: 16px;
  }
`;

const EditButton = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 10px 20px;
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Profile = () => {
  const { user, loading, refreshUser } = useAuth();
  const updateProfileMutation = UpdateProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingContainer>Loading profile...</LoadingContainer>
      </ProfileContainer>
    );
  }

  if (!user) {
    return (
      <ProfileContainer>
        <ErrorContainer>
          Unable to load profile. Please try logging in again.
        </ErrorContainer>
      </ProfileContainer>
    );
  }

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatPhoneToServer = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("0")) {
      return "+84" + phone.substring(1);
    }
    return phone;
  };

  const handleUpdateProfile = (formData) => {
    const formattedPhone = formatPhoneToServer(formData.phone);

    const payload = {
      name: formData.name,
      phone: formattedPhone,
      address: formData.address,
    };

    updateProfileMutation.mutate(
      { payload },
      {
        onSuccess: (response) => {
          const businessStatus = response?.status;

          if (businessStatus === 200 || businessStatus === 201) {
            setIsEditModalOpen(false);
            setSuccessMessage("Profile updated successfully!");
            setIsSuccess(true);

            if (refreshUser) {
              refreshUser();
            }
          } else {
            const errMsg =
              response?.message || "An error occurred while updating profile";
            setErrorMessage(errMsg);
            setIsError(true);
          }
        },
        onError: (error) => {
          const errMsg =
            error?.response?.data?.message || "Failed to update profile";
          setErrorMessage(errMsg);
          setIsError(true);
        },
      },
    );
  };

  return (
    <>
      <ProfileContainer>
        <ProfileHeader>
          <Avatar>{getInitials(user.name)}</Avatar>
          <HeaderInfo>
            <h2>{user.name || "No Name"}</h2>
            <RoleBadge $role={user.role}>{user.role || "User"}</RoleBadge>
            {user.role === "student" && (
              <AccountStatus $completed={user.accountSetupCompleted}>
                {user.accountSetupCompleted
                  ? "Account Setup Completed"
                  : "Setup Incomplete"}
              </AccountStatus>
            )}
          </HeaderInfo>
          <HeaderActions>
            <EditButton onClick={() => setIsEditModalOpen(true)}>
              Edit Profile
            </EditButton>
          </HeaderActions>
        </ProfileHeader>

        <InfoSection>
          <SectionTitle>Contact Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>
                {user.email || <EmptyValue>Not set</EmptyValue>}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Phone Number</InfoLabel>
              <InfoValue>
                {user.phone || <EmptyValue>Not provided</EmptyValue>}
              </InfoValue>
            </InfoItem>

            <InfoItem style={{ gridColumn: "1 / -1" }}>
              <InfoLabel>Address</InfoLabel>
              <InfoValue>
                {user.address || <EmptyValue>Not provided</EmptyValue>}
              </InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoSection>

        <InfoSection>
          <SectionTitle>Account Details</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>User ID</InfoLabel>
              <InfoValue style={{ fontSize: "14px", fontFamily: "monospace" }}>
                {user.userId || <EmptyValue>N/A</EmptyValue>}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Created Date</InfoLabel>
              <InfoValue>{formatDate(user.createdAt)}</InfoValue>
            </InfoItem>

            {user.createdBy && (
              <InfoItem>
                <InfoLabel>Created By</InfoLabel>
                <InfoValue
                  style={{ fontSize: "14px", fontFamily: "monospace" }}
                >
                  {user.createdBy}
                </InfoValue>
              </InfoItem>
            )}
          </InfoGrid>
        </InfoSection>
      </ProfileContainer>

      {/* EDIT MODAL */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
        user={user}
        isLoading={updateProfileMutation.isPending}
      />

      {/* SUCCESS POPUP */}
      {isSuccess && (
        <SuccessPopUp
          message={successMessage}
          action={() => {
            setIsSuccess(false);
            setSuccessMessage("");
            updateProfileMutation.reset();
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
            updateProfileMutation.reset();
          }}
        />
      )}
    </>
  );
};

export default Profile;
