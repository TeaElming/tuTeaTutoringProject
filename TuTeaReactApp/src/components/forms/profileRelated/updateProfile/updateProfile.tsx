/** @format */

import React, { useState } from "react"
import "./popup.css"

// Define the User interface
interface User {
	name: string
	email: string
	pendingRelationships: string[]
	students: string[]
	tutors: string[]
	permissionLevel: number
	joinedAt: string
}

interface UpdateProfilePopupProps {
	user: User
	onClose: () => void
	onSubmit: (updatedUser: Partial<User>) => void
}

const UpdateProfilePopup: React.FC<UpdateProfilePopupProps> = ({
	user,
	onClose,
	onSubmit,
}) => {
	const [name, setName] = useState(user.name)
	const [email, setEmail] = useState(user.email)
	const [permissionLevel, setPermissionLevel] = useState(user.permissionLevel)

	const handleSubmit = () => {
		onSubmit({ name, email, permissionLevel })
		onClose()
	}

	return (
		<div className="popup-overlay">
			<div className="popup">
				<h2>Edit Profile</h2>
				<input
					type="text"
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<select
					value={permissionLevel}
					onChange={(e) => setPermissionLevel(parseInt(e.target.value))}
				>
					<option value={0}>Admin</option>
					<option value={1}>Tutor</option>
					<option value={2}>Student</option>
				</select>
				<button onClick={handleSubmit}>Save</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	)
}

export default UpdateProfilePopup
