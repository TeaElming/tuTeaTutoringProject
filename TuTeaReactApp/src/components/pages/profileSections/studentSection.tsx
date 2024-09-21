/** @format */

import React, { useState, useEffect } from "react"
import AddStudentPopup from "../../forms/profileRelated/addStudentPopup"
import ConfirmationPopup from "./popups/confirmationPopup"
import "./css/profileSection.css" // Assuming you want to use the same CSS file

interface StudentSectionProps {
	students: DetailedInfo[]
	onAddStudentSuccess: () => void
	tutorEmail: string // Pass tutor email as a prop
}

interface DetailedInfo {
	id: string
	name: string
	email: string
}

const StudentSection: React.FC<StudentSectionProps> = ({
	students,
	onAddStudentSuccess,
	tutorEmail,
}) => {
	const [showAddStudentPopup, setShowAddStudentPopup] = useState(false)
	const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
	const [selectedStudentEmail, setSelectedStudentEmail] = useState<
		string | null
	>(null)
	const [error, setError] = useState<string>("")

	// Ensure only one modal state is true at any time
	const closeAllPopups = () => {
		setShowAddStudentPopup(false)
		setShowConfirmationPopup(false)
		setSelectedStudentEmail(null)
	}

	const handleDeleteStudent = async () => {
		if (!selectedStudentEmail || !tutorEmail) {
			setError("Student email or tutor email is missing")
			console.error("Student email or tutor email is missing")
			closeAllPopups()
			return
		}

		try {
			console.log("Initiating DELETE request...")

			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				console.error("No authorization token found.")
				closeAllPopups()
				return
			}

			// Set the correct URL for the DELETE request
			const deletionUrl = `${
				process.env.REACT_APP_USER_URL_REL ||
				"https://cscloud8-85.lnu.se/tuTea/user-service/api/v1/relationships"
			}/relationships`

			console.log(`DELETE Request URL: ${deletionUrl}`)
			console.log(
				`Request Body: { studentEmail: ${selectedStudentEmail}, tutorEmail: ${tutorEmail} }`
			)

			const response = await fetch(deletionUrl, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					studentEmail: selectedStudentEmail,
					tutorEmail,
				}),
			})

			if (!response.ok) {
				const errorMessage = await response.text()
				setError(`Failed to delete relationship: ${errorMessage}`)
				console.error(`Failed to delete relationship: ${errorMessage}`)
				return
			}

			console.log("Successfully deleted the relationship")

			// Successfully deleted the relationship
			closeAllPopups()
			onAddStudentSuccess() // Refresh the student list after deletion
		} catch (error: any) {
			setError(`An error occurred: ${error.message}`)
			console.error(`An error occurred: ${error.message}`)
			closeAllPopups()
		}
	}

	const openConfirmationPopup = (studentEmail: string) => {
		if (!studentEmail) {
			setError("Student email is missing")
			console.error("Student email is missing")
			return
		}
		setSelectedStudentEmail(studentEmail)
		setShowConfirmationPopup(true)
	}

	useEffect(() => {
		if (!tutorEmail) {
			setError("Tutor email is missing")
			console.error("Tutor email is missing")
		}
	}, [tutorEmail])

	return (
		<div className="profileSection">
			<h2>Students</h2>
			<button
				className="addStudentButton"
				onClick={() => {
					closeAllPopups()
					setShowAddStudentPopup(true)
				}}
			>
				Add Student
			</button>
			{students.length > 0 ? (
				<table className="studentTable">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{students.map((student) => (
							<tr key={student.id} className="profileItem">
								<td>{student.name}</td>
								<td>{student.email}</td>
								<td>
									<button
										className="deleteButton"
										onClick={() => openConfirmationPopup(student.email)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<div>No students assigned.</div>
			)}

			{showAddStudentPopup && (
				<AddStudentPopup
					onClose={() => setShowAddStudentPopup(false)}
					onSuccess={() => {
						closeAllPopups()
						onAddStudentSuccess()
					}}
				/>
			)}

			<ConfirmationPopup
				isOpen={showConfirmationPopup}
				message={`Are you sure you want to delete the relationship with ${selectedStudentEmail}?`}
				onConfirm={handleDeleteStudent}
				onCancel={() => setShowConfirmationPopup(false)}
			/>

			{error && <div className="errorMessage">{error}</div>}
		</div>
	)
}

export default StudentSection
