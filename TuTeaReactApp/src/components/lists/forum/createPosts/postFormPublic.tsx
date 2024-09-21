/** @format */

import React, { useState } from "react"
import styles from "./PostForm.module.css"

interface PostFormPublicProps {
	onPostCreated: () => void
}

const PostFormPublic: React.FC<PostFormPublicProps> = ({ onPostCreated }) => {
	const [title, setTitle] = useState<string>("")
	const [content, setContent] = useState<string>("")
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async () => {
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
			access: "public",
		}

		const postUrl =
			process.env.REACT_APP_FORUM_POSTS_URL ||
			"https://cscloud8-85.lnu.se/tuTea/forum-service/api/v1/posts"

		try {
			const response = await fetch(postUrl, {
				method: "POST",
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

			setTitle("")
			setContent("")
			onPostCreated()
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	return (
		<div className={styles.formContainer}>
			<h3 className={styles.formHeading}>Create Public Post</h3>
			{error && <div className={styles.errorMessage}>{error}</div>}
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
			<button onClick={handleSubmit} className={styles.submitButton}>
				Create Public Post
			</button>
		</div>
	)
}

export default PostFormPublic
