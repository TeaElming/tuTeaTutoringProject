/** @format */

import React, { useState, useEffect } from "react"

interface RelationshipSelectorProps {
	setRelationships: (relationships: string[]) => void
}

interface Relationship {
	_id: string
	studentId: User
	tutorId: User
	status: string
	role: string
}

interface User {
	name: string
	email: string
	id: string
}

const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
	setRelationships,
}) => {
	const [relationships, setRelationshipData] = useState<Relationship[]>([])
	const [selectedRelationships, setSelectedRelationships] = useState<string[]>(
		[]
	)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchRelationships = async () => {
			const userId = sessionStorage.getItem("currentUserId")
			const jwtToken = sessionStorage.getItem("jwt")
			if (userId && jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_REL}/all`,
						{
							headers: {
								Authorization: `Bearer ${jwtToken}`,
							},
						}
					)

					if (!response.ok) {
						throw new Error(
							"Error fetching relationships: " + response.statusText
						)
					}

					const data: Relationship[] = await response.json()
					const confirmedRelationships = data.filter(
						(relationship) => relationship.status === "confirmed"
					)

					if (confirmedRelationships.length === 0) {
						setError("No confirmed relationships found.")
					} else {
						setRelationshipData(confirmedRelationships)
					}
				} catch (error: any) {
					setError(
						error.message || "An error occurred while fetching relationships."
					)
				}
			}
		}

		fetchRelationships()
	}, [])

	const toggleRelationship = (id: string) => {
		setSelectedRelationships((prev) => {
			const newSelection = prev.includes(id)
				? prev.filter((rel) => rel !== id)
				: [...prev, id]
			setRelationships(newSelection) // Update the parent component with the new selection
			return newSelection
		})
	}

	const getNonReqUserData = (relationship: Relationship) => {
		const userId = sessionStorage.getItem("currentUserId")
		if (userId === relationship.studentId.id) {
			return {
				name: relationship.tutorId.name,
				role: "tutor",
				id: relationship._id,
			}
		} else if (userId === relationship.tutorId.id) {
			return {
				name: relationship.studentId.name,
				role: "student",
				id: relationship._id,
			}
		} else {
			return null
		}
	}

	return (
		<div>
			<h3>Select Relationships</h3>
			{error && <div style={{ color: "red" }}>{error}</div>}
			{relationships.length === 0 ? (
				<p>No confirmed relationships found.</p>
			) : (
				relationships.map((relationship) => {
					const nonReqUserData = getNonReqUserData(relationship)
					if (!nonReqUserData) return null

					return (
						<div key={relationship._id}>
							<label>
								<input
									type="checkbox"
									checked={selectedRelationships.includes(relationship._id)}
									onChange={() => toggleRelationship(relationship._id)}
								/>
								{`${nonReqUserData.name} - ${nonReqUserData.role} - ${relationship._id}`}
							</label>
						</div>
					)
				})
			)}
		</div>
	)
}

export default RelationshipSelector
