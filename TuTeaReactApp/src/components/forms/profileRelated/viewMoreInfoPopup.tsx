/** @format */

import React, { useState, useEffect } from "react"

interface ViewMoreInfoPopupProps {
	relationship: {
		_id: string
		studentId: string
		tutorId: string
		status: string
		createdBy: string
		createdAt: string
	}
	onClose: () => void
	userId: string
	isSender: boolean
}
const ViewMoreInfoPopup: React.FC<ViewMoreInfoPopupProps> = ({
	relationship,
	onClose,
	userId,
	isSender,
}) => {
	const [studentInfo, setStudentInfo] = useState<{
		name: string
		email: string
	} | null>(null)
	const [tutorInfo, setTutorInfo] = useState<{
		name: string
		email: string
	} | null>(null)

	useEffect(() => {
		const fetchRelationshipDetails = async () => {
			const jwtToken = sessionStorage.getItem("jwt")
			if (jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_REL}/${relationship._id}`,
						{
							headers: {
								Authorization: `Bearer ${jwtToken}`,
							},
						}
					)
					if (response.ok) {
						const data = await response.json()
						setStudentInfo(data.studentInfo)
						setTutorInfo(data.tutorInfo)
					} else {
						console.error(
							"Error fetching relationship details:",
							response.statusText
						)
					}
				} catch (error) {
					console.error("Error fetching relationship details:", error)
				}
			}
		}

		fetchRelationshipDetails()
	}, [relationship._id])

	const handleConfirm = async () => {
		const jwtToken = sessionStorage.getItem("jwt")
		if (jwtToken) {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_USER_URL_REL}/confirm`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${jwtToken}`,
						},
						body: JSON.stringify({
							studentEmail: studentInfo?.email,
							tutorEmail: tutorInfo?.email,
						}),
					}
				)
				if (response.ok) {
					alert("Relationship confirmed successfully")
					onClose()
				} else {
					console.error("Error confirming relationship:", response.statusText)
				}
			} catch (error) {
				console.error("Error confirming relationship:", error)
			}
		}
	}

	const handleDecline = async () => {
		if (confirm("Are you sure you want to decline this request?")) {
			const jwtToken = sessionStorage.getItem("jwt")
			if (jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_REL}/decline`,
						{
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${jwtToken}`,
							},
							body: JSON.stringify({
								studentEmail: studentInfo?.email,
								tutorEmail: tutorInfo?.email,
							}),
						}
					)
					if (response.ok) {
						alert("Relationship declined successfully")
						onClose()
					} else {
						console.error("Error declining relationship:", response.statusText)
					}
				} catch (error) {
					console.error("Error declining relationship:", error)
				}
			}
		}
	}

	if (!studentInfo || !tutorInfo) {
		return <div>Loading...</div>
	}

	return (
		<div className="popup">
			<div className="popup-content">
				<h2>Relationship Details</h2>
				<div>
					<strong>Student Name:</strong> {studentInfo.name}
				</div>
				<div>
					<strong>Student Email:</strong> {studentInfo.email}
				</div>
				<div>
					<strong>Tutor Name:</strong> {tutorInfo.name}
				</div>
				<div>
					<strong>Tutor Email:</strong> {tutorInfo.email}
				</div>
				<div>
					<strong>Created At:</strong>{" "}
					{new Date(relationship.createdAt).toLocaleString()}
				</div>
				{!isSender && (
					<div>
						<button onClick={handleConfirm}>Confirm</button>
						<button onClick={handleDecline}>Decline</button>
					</div>
				)}
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	)
}

export default ViewMoreInfoPopup
