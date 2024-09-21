/** @format */

// DeleteProfile.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/deleteProfile.module.css"; // Assume you have some CSS for styling

interface DeleteProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteProfile: React.FC<DeleteProfileProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleDeleteProfile = async () => {
    const currentUserId = sessionStorage.getItem("currentUserId");
    const jwtToken = sessionStorage.getItem("jwt");

    if (!currentUserId || !jwtToken) {
      alert("User not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_USER_URL_USERS}/${currentUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete profile.");
      }

      // Successfully deleted the profile
      handleLogout();
    } catch (error: any) {
      console.error("Error deleting profile:", error.message);
      alert("An error occurred while deleting your profile.");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear the session storage
    navigate("/start"); // Redirect to start or login page
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>Delete Profile</h2>
        <p>Are you sure you want to delete your profile?</p>
        <div className={styles.buttonContainer}>
          <button onClick={handleDeleteProfile} className={styles.yesButton}>
            Yes
          </button>
          <button onClick={onClose} className={styles.noButton}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
