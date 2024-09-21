/** @format */

import React, { useState } from "react"
import "./popup.css"

interface UpdatePasswordPopupProps {
  onClose: () => void
  onSubmit: (oldPassword: string, newPassword: string, confirmPassword: string) => void
}

const UpdatePasswordPopup: React.FC<UpdatePasswordPopupProps> = ({ onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = () => {
    onSubmit(oldPassword, newPassword, confirmPassword)
  }

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Update Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

export default UpdatePasswordPopup
