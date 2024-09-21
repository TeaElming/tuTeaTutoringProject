/** @format */

import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import styles from "./createPostModal.module.css"

interface RespondToPostModalProps {
	isOpen: boolean
	onClose: () => void
	post: {
		_id: string
		title: string
		content: string
		response: string
		createdBy: string 
		createdAt: string
		access: string
		pinned: boolean
		flagged: boolean
	}
	onPostUpdated: () => void
}

const RespondToPostModal: React.FC<RespondToPostModalProps> = ({
	isOpen,
	onClose,
	post,
	onPostUpdated,
}) => {
	const [response, setResponse] = useState<string>("")
	const [error, setError] = useState<string | null>(null)
	const [isEditable, setIsEditable] = useState<boolean>(false)

	useEffect(() => {
		const fetchPostResponse = async () => {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return
			}

			try {
				const response = await fetch(
					`${
						process.env.REACT_APP_FORUM_URL ||
						"https://cscloud8-85.lnu.se/tuTea/forum-service/api/v1"
					}/${post._id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				)

				if (!response.ok) {
					throw new Error("Failed to fetch post details.")
				}

				const data = await response.json()
				setResponse(data.response || "")

				const currentStudentId = sessionStorage.getItem("currentUserId")

				// Allow editing if the response is empty or if the current user created the response
				setIsEditable(!data.response || currentStudentId === data.createdBy)
			} catch (error: any) {
				setError("Failed to load the response for this post.")
			}
		}

		if (isOpen) {
			fetchPostResponse() // Fetch the specific response when the modal opens
		}
	}, [isOpen, post._id])

	const handleUpdateResponse = async () => {
		const currentStudentId = sessionStorage.getItem("currentUserId")
		const token = sessionStorage.getItem("jwt")

		if (!currentStudentId || !token) {
			setError("No current student ID or token found.")
			return
		}

		const body = {
			response,
		}

		const postUrl = `${
			process.env.REACT_APP_FORUM_URL ||
			"https://cscloud8-85.lnu.se/tuTea/forum-service/api/v1"
		}/${post._id}`

		try {
			const response = await fetch(postUrl, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(body),
			})

			if (!response.ok) {
				const errorMessage = await response.text()
				setError(errorMessage)
				return
			}

			onPostUpdated()
			onClose() // Close the modal after update
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className={styles.modalContent}
			overlayClassName={styles.modalOverlay}
			ariaHideApp={false}
		>
			<div className={styles.modalContainer}>
				<button onClick={onClose} className={styles.closeButton}>
					&times;
				</button>
				<h2 className={styles.text}>Respond to Post</h2>
				<div>
					<textarea
						placeholder="Add your response here..."
						value={response}
						onChange={(e) => setResponse(e.target.value)}
						className={styles.textArea}
						readOnly={!isEditable} // Make textarea editable if allowed
					></textarea>
				</div>
				{error && <div className={styles.errorMessage}>{error}</div>}
				{isEditable && (
					<button
						onClick={handleUpdateResponse}
						className={styles.submitButton}
					>
						Update Response
					</button>
				)}
				<button onClick={onClose} className={styles.closeModalButton}>
					Cancel
				</button>
			</div>
		</Modal>
	)
}

export default RespondToPostModal
