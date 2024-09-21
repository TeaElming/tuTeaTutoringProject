/** @format */

import React from "react"
import "./css/personalInfoSection.css" // Import the new CSS file

interface PersonalInfoSectionProps {
	user: {
		name: string
		email: string
		permissionLevel: number
		joinedAt: string
	}
	onEditProfile: () => void
	onUpdatePassword: () => void
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
	user,
	onEditProfile,
	onUpdatePassword,
}) => {
	return (
		<div className="profileSection">
			<h2>Personal Information</h2>
			<div className="profileItem">
				<span>Name: {user.name}</span>
			</div>
			<div className="profileItem">
				<span>Email: {user.email}</span>
			</div>
			<div className="profileItem">
				<span>
					Permission Level:{" "}
					{user.permissionLevel === 0
						? "Admin"
						: user.permissionLevel === 1
						? "Tutor"
						: user.permissionLevel === 2
						? "Student"
						: "Unknown"}
				</span>
			</div>
			<div className="profileItem">
				<span>Joined At: {new Date(user.joinedAt).toLocaleDateString()}</span>
			</div>
			<div className="buttonDivEdit">
				<button onClick={onEditProfile}>Edit Profile</button>
				<button onClick={onUpdatePassword}>Update Password</button>
			</div>
		</div>
	)
}

export default PersonalInfoSection
