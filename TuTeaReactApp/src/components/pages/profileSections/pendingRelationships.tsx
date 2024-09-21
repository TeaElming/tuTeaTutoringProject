/** @format */

import React, { useEffect, useState } from "react"
import "../css/profilePage.css"
import ViewMoreInfoPopup from "../../forms/profileRelated/viewMoreInfoPopup"

interface Relationship {
	_id: string
	studentId: string
	tutorId: string
	status: string
	createdBy: string
	createdAt: string
}

interface User {
	_id: string
	name: string
	email: string
}

const PendingRelationships: React.FC = () => {
	const [relationships, setRelationships] = useState<Relationship[]>([])
	const [selectedRelationship, setSelectedRelationship] =
		useState<Relationship | null>(null)
	const [user, setUser] = useState<User | null>(null)
	const [showPopup, setShowPopup] = useState(false)
	const [isSender, setIsSender] = useState(false)

	useEffect(() => {
		const fetchUser = async () => {
			const userId = sessionStorage.getItem("currentUserId")
			const jwtToken = sessionStorage.getItem("jwt")
			if (userId && jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_USERS}/${userId}`,
						{
							headers: {
								Authorization: `Bearer ${jwtToken}`,
							},
						}
					)
					if (response.ok) {
						const userData = await response.json()
						setUser(userData)
					} else {
						console.error("Error fetching user:", response.statusText)
					}
				} catch (error) {
					console.error("Error fetching user:", error)
				}
			}
		}

		const fetchPendingRelationships = async () => {
			const jwtToken = sessionStorage.getItem("jwt")
			if (jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_REL}/pending`,
						{
							headers: {
								Authorization: `Bearer ${jwtToken}`,
							},
						}
					)
					if (response.ok) {
						const pendingRelationshipData = await response.json()
						if (pendingRelationshipData.length > 0) {
							setRelationships(pendingRelationshipData)
						} else {
							setRelationships([])
						}
					} else {
						console.error(
							"Error fetching pending relationships:",
							response.statusText
						)
					}
				} catch (error) {
					console.error("Error fetching pending relationships:", error)
				}
			}
		}

		fetchUser()
		fetchPendingRelationships()
	}, [])

	const handleViewMoreInfo = (relationship: Relationship) => {
		const userId = sessionStorage.getItem("currentUserId")
		if (userId) {
			setIsSender(userId === relationship.createdBy)
		}
		setSelectedRelationship(relationship)
		setShowPopup(true)
	}

	if (!user) {
		return <div>Loading...</div>
	}

	return (
		<div className="profileSection">
			<h2>Pending Relationships</h2>
			{relationships.length > 0 ? (
				relationships.map((relationship) => {
					const userId = sessionStorage.getItem("currentUserId")
					let message = ""

					if (userId) {
						if (userId === relationship.createdBy) {
							if (userId === relationship.studentId) {
								message = `You have sent a request to a tutor.`
							} else if (userId === relationship.tutorId) {
								message = `You have sent a request to a student.`
							}
						} else {
							if (userId === relationship.studentId) {
								message = `You have received a request from a tutor.`
							} else if (userId === relationship.tutorId) {
								message = `You have received a request from a student.`
							}
						}
					}

					return (
						<div key={relationship._id} className="profileItem">
							<span>{message}</span>
							<button onClick={() => handleViewMoreInfo(relationship)}>
								View more info
							</button>
						</div>
					)
				})
			) : (
				<div>No pending relationships.</div>
			)}

			{showPopup && selectedRelationship && (
				<ViewMoreInfoPopup
					relationship={selectedRelationship}
					onClose={() => setShowPopup(false)}
					userId={user._id}
					isSender={isSender}
				/>
			)}
		</div>
	)
}

export default PendingRelationships
