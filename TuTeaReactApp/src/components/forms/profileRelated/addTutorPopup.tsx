/** @format */

import React, { useEffect, useState } from "react"
//import "./popup.css"

interface AddTutorPopupProps {
	onClose: () => void
	onSuccess: () => void // Callback to notify success
}

const AddTutorPopup: React.FC<AddTutorPopupProps> = ({
	onClose,
	onSuccess,
}) => {
	const [studentEmail, setStudentEmail] = useState("")
	const [tutorEmail, setTutorEmail] = useState("")
	const [jwtToken, setJwtToken] = useState("")

	useEffect(() => {
		const fetchUserEmail = async () => {
			const userId = sessionStorage.getItem("currentUserId")
			const token = sessionStorage.getItem("jwt")
			if (userId && token) {
				setJwtToken(token)
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_USERS}/${userId}`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)
					if (response.ok) {
						const userData = await response.json()
						setStudentEmail(userData.email)
					} else {
						console.error("Error fetching user:", response.statusText)
					}
				} catch (error) {
					console.error("Error fetching user:", error)
				}
			}
		}

		fetchUserEmail()
	}, [])

	const handleSubmit = async () => {
		if (jwtToken) {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_USER_URL_REL}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${jwtToken}`,
						},
						body: JSON.stringify({ studentEmail, tutorEmail }),
					}
				)
				if (response.ok) {
					alert("Pending relationship created successfully")
					onSuccess()
				} else {
					const data = await response.json()
					alert(`Error: ${data.error}`)
				}
			} catch (error) {
				console.error("Error:", error)
			}
		}
		onClose()
	}

	return (
		<div className="popup-overlay">
			<div className="popup">
				<h2>Add Tutor</h2>
				<input
					type="text"
					placeholder="Tutor Email"
					value={tutorEmail}
					onChange={(e) => setTutorEmail(e.target.value)}
				/>
				<button onClick={handleSubmit}>Submit</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	)
}

export default AddTutorPopup
