/** @format */

import React, { useState } from "react"
import Modal from "react-modal"
import styles from "./createPostModal.module.css"

interface UpdatePostModalProps {
	isOpen: boolean
	onClose: () => void
	post: {
		_id: string
		title: string
		content: string
		createdAt: string
		access: string
		pinned: boolean
		flagged: boolean
	}
	onPostUpdated: () => void
}

const UpdatePostModal: React.FC<UpdatePostModalProps> = ({
	isOpen,
	onClose,
	post,
	onPostUpdated,
}) => {
	const [title, setTitle] = useState<string>(post.title)
	const [content, setContent] = useState<string>(post.content)
	const [error, setError] = useState<string | null>(null)

	const handleUpdate = async () => {
		const currentStudentId = sessionStorage.getItem("currentUserId")
		const token = sessionStorage.getItem("jwt")

		if (!currentStudentId || !token) {
			setError("No current student ID or token found.")
			return
		}

		const body = {
			title,
			content,
			createdBy: currentStudentId,
			access: post.access, // Maintain the existing access setting
		}

		const postUrl = `${
			process.env.REACT_APP_FORUM_URL ||
			"https://cscloud8-85.lnu.se/tuTea/forum-service/api/v1/"
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
				<h2 className={styles.text}>Update Post</h2>
				<div className={styles.infoText}>
					<strong>Access:</strong>{" "}
					{post.access === "public" ? "Public" : "Private"}
				</div>
				<div>
					<input
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className={styles.inputField}
					/>
				</div>
				<div>
					<textarea
						placeholder="Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className={styles.textArea}
					></textarea>
				</div>
				{error && <div className={styles.errorMessage}>{error}</div>}
				<button onClick={handleUpdate} className={styles.submitButton}>
					Update Post
				</button>
				<button onClick={onClose} className={styles.closeModalButton}>
					Cancel
				</button>
			</div>
		</Modal>
	)
}

export default UpdatePostModal
