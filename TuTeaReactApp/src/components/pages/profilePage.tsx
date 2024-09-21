/** @format */

import React, { useEffect, useState } from "react"
import "./css/profilePage.css"
import UpdateProfilePopup from "../forms/profileRelated/updateProfile/updateProfile"
import UpdatePasswordPopup from "../forms/profileRelated/updateProfile/updatePassword"
import PendingRelationships from "./profileSections/pendingRelationships"
import StudentSection from "./profileSections/studentSection"
import TutorSection from "./profileSections/tutorSection"
import PersonalInfoSection from "./profileSections/personalInfoSection"
import DeleteProfile from "./profileSections/deleteProfile"

interface User {
	name: string
	email: string
	pendingRelationships: string[]
	students: string[]
	tutors: string[]
	permissionLevel: number
	joinedAt: string
}

interface DetailedInfo {
	id: string
	name: string
	email: string
	relationshipType: "tutor" | "student"
}

const ProfilePage: React.FC = () => {
	const [user, setUser] = useState<User | null>(null)
	const [detailedTutors, setDetailedTutors] = useState<DetailedInfo[]>([])
	const [detailedStudents, setDetailedStudents] = useState<DetailedInfo[]>([])
	const [showUpdateProfilePopup, setShowUpdateProfilePopup] = useState(false)
	const [showUpdatePasswordPopup, setShowUpdatePasswordPopup] = useState(false)
	const [showDeleteProfilePopup, setShowDeleteProfilePopup] = useState(false) // State for delete profile popup

	const fetchUserDetails = async (
		ids: string[],
		jwtToken: string,
		relationshipType: "tutor" | "student"
	): Promise<DetailedInfo[]> => {
		const promises = ids.map(async (id) => {
			const response = await fetch(
				`${process.env.REACT_APP_USER_URL_USERS}/${id}`,
				{
					headers: {
						Authorization: `Bearer ${jwtToken}`,
					},
				}
			)
			if (response.ok) {
				const data = await response.json()
				return {
					id: data.id,
					name: data.name,
					email: data.email,
					relationshipType,
				}
			} else {
				console.error(
					`Error fetching details for ID ${id}:`,
					response.statusText
				)
				return { id, name: "Unknown", email: "Unknown", relationshipType }
			}
		})
		return Promise.all(promises)
	}

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

					const tutors = await fetchUserDetails(
						userData.tutors,
						jwtToken,
						"tutor"
					)
					setDetailedTutors(tutors)

					const students = await fetchUserDetails(
						userData.students,
						jwtToken,
						"student"
					)
					setDetailedStudents(students)
				} else {
					console.error("Error fetching user:", response.statusText)
				}
			} catch (error) {
				console.error("Error fetching user:", error)
			}
		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	const handleUpdateProfile = async (updatedUser: Partial<User>) => {
		const userId = sessionStorage.getItem("currentUserId")
		const jwtToken = sessionStorage.getItem("jwt")
		if (userId && jwtToken) {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_USER_URL_USERS}/${userId}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${jwtToken}`,
						},
						body: JSON.stringify(updatedUser),
					}
				)
				if (response.ok) {
					const updatedUserData = await response.json()
					setUser(updatedUserData)

					const tutors = await fetchUserDetails(
						updatedUserData.tutors,
						jwtToken,
						"tutor"
					)
					setDetailedTutors(tutors)

					const students = await fetchUserDetails(
						updatedUserData.students,
						jwtToken,
						"student"
					)
					setDetailedStudents(students)
				} else {
					console.error("Error updating user:", response.statusText)
				}
			} catch (error) {
				console.error("Error updating user:", error)
			}
		}
	}

	const handleUpdatePassword = async (
		oldPassword: string,
		newPassword: string,
		confirmPassword: string
	) => {
		if (newPassword !== confirmPassword) {
			alert("New passwords do not match")
			return
		}

		const userId = sessionStorage.getItem("currentUserId")
		const jwtToken = sessionStorage.getItem("jwt")
		if (userId && jwtToken) {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_USER_URL_USERS}/${userId}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${jwtToken}`,
						},
						body: JSON.stringify({ oldPassword, newPassword }),
					}
				)
				if (response.ok) {
					alert("Password updated successfully")
					setShowUpdatePasswordPopup(false)
				} else {
					const errorData = await response.json()
					alert(`Error updating password: ${errorData.message}`)
				}
			} catch (error) {
				console.error("Error updating password:", error)
			}
		}
	}

	if (!user) {
		return <div>Loading...</div>
	}

	return (
		<div className="profilePageContainer">
			<div className="personalInfoDiv">
				<PersonalInfoSection
					user={user}
					onEditProfile={() => setShowUpdateProfilePopup(true)}
					onUpdatePassword={() => setShowUpdatePasswordPopup(true)}
				/>
			</div>
			<div className="studentSectionDiv">
				<StudentSection
					students={detailedStudents}
					tutorEmail={user.email}
					onAddStudentSuccess={fetchUser}
				/>
			</div>
			<div className="tutorSectionDiv">
				<TutorSection
					tutors={detailedTutors}
					studentEmail={user.email} // Pass student email to TutorSection
					onAddTutorSuccess={fetchUser}
				/>
			</div>
			<div className="pendingRelationshipsDiv">
				<PendingRelationships />
			</div>

			{showUpdateProfilePopup && user && (
				<UpdateProfilePopup
					user={user}
					onClose={() => setShowUpdateProfilePopup(false)}
					onSubmit={handleUpdateProfile}
				/>
			)}

			{showUpdatePasswordPopup && (
				<UpdatePasswordPopup
					onClose={() => setShowUpdatePasswordPopup(false)}
					onSubmit={handleUpdatePassword}
				/>
			)}
			<button
				className="deleteProfileButton"
				onClick={() => setShowDeleteProfilePopup(true)}
			>
				Delete Profile
			</button>

			{showDeleteProfilePopup && (
				<DeleteProfile
					isOpen={showDeleteProfilePopup}
					onClose={() => setShowDeleteProfilePopup(false)}
				/>
			)}
		</div>
	)
}

export default ProfilePage
