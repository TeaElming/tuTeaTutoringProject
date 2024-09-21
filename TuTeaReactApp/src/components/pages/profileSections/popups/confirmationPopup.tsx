/** @format */

import React from "react";
import styles from "./css/confirmationPopup.module.css"; // Make sure to create a CSS file for styling

interface ConfirmationPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; // Do not render anything if the popup is not open

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.title}>Confirm Action</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
