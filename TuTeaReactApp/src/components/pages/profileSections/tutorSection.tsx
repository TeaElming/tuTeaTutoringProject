/** @format */

import React, { useState, useEffect } from "react"
import AddTutorPopup from "../../forms/profileRelated/addTutorPopup"
import ConfirmationPopup from "./popups/confirmationPopup"
import "./css/profileSection.css" // Reusing the same CSS file

interface TutorSectionProps {
	tutors: DetailedInfo[]
	onAddTutorSuccess: () => void
	studentEmail: string // Pass student email as a prop
}

interface DetailedInfo {
	id: string
	name: string
	email: string
}

const TutorSection: React.FC<TutorSectionProps> = ({
	tutors,
	onAddTutorSuccess,
	studentEmail,
}) => {
	const [showAddTutorPopup, setShowAddTutorPopup] = useState(false)
	const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
	const [selectedTutorEmail, setSelectedTutorEmail] = useState<string | null>(
		null
	)
	const [error, setError] = useState<string>("")

	// Ensure only one modal state is true at any time
	const closeAllPopups = () => {
		setShowAddTutorPopup(false)
		setShowConfirmationPopup(false)
		setSelectedTutorEmail(null)
	}

	const handleDeleteTutor = async () => {
		if (!selectedTutorEmail || !studentEmail) {
			setError("Tutor email or student email is missing")
			console.error("Tutor email or student email is missing")
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
				`Request Body: { studentEmail: ${studentEmail}, tutorEmail: ${selectedTutorEmail} }`
			)

			const response = await fetch(deletionUrl, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ studentEmail, tutorEmail: selectedTutorEmail }),
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
			onAddTutorSuccess() // Refresh the tutor list after deletion
		} catch (error: any) {
			setError(`An error occurred: ${error.message}`)
			console.error(`An error occurred: ${error.message}`)
			closeAllPopups()
		}
	}

	const openConfirmationPopup = (tutorEmail: string) => {
		if (!tutorEmail) {
			setError("Tutor email is missing")
			console.error("Tutor email is missing")
			return
		}
		setSelectedTutorEmail(tutorEmail)
		setShowConfirmationPopup(true)
	}

	useEffect(() => {
		if (!studentEmail) {
			setError("Student email is missing")
			console.error("Student email is missing")
		}
	}, [studentEmail])

	return (
		<div className="profileSection">
			<h2>Tutors</h2>
			<button
				className="addStudentButton"
				onClick={() => {
					closeAllPopups()
					setShowAddTutorPopup(true)
				}}
			>
				Add Tutor
			</button>
			{tutors.length > 0 ? (
				<table className="studentTable">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{tutors.map((tutor) => (
							<tr key={tutor.id} className="profileItem">
								<td>{tutor.name}</td>
								<td>{tutor.email}</td>
								<td>
									<button
										className="deleteButton"
										onClick={() => openConfirmationPopup(tutor.email)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<div>No tutors assigned.</div>
			)}

			{showAddTutorPopup && (
				<AddTutorPopup
					onClose={() => setShowAddTutorPopup(false)}
					onSuccess={() => {
						closeAllPopups()
						onAddTutorSuccess()
					}}
				/>
			)}

			<ConfirmationPopup
				isOpen={showConfirmationPopup}
				message={`Are you sure you want to delete the relationship with ${selectedTutorEmail}?`}
				onConfirm={handleDeleteTutor}
				onCancel={() => setShowConfirmationPopup(false)}
			/>

			{error && <div className="errorMessage">{error}</div>}
		</div>
	)
}

export default TutorSection
