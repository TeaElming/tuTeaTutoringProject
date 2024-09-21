/** @format */

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./css/latestPosts.module.css"

interface Post {
	_id: string
	title: string
	content: string
	createdAt: string
	access: string
	pinned: boolean
	flagged: boolean
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

const LatestPosts: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([])
	const [error, setError] = useState<string>("")
	const [relationshipIds, setRelationshipIds] = useState<string[]>([])
	const [relationshipsLoaded, setRelationshipsLoaded] = useState<boolean>(false)

	const navigate = useNavigate()

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
				const confirmedRelationships = data
					.filter((relationship) => relationship.status === "confirmed")
					.map((relationship) => relationship._id)

				if (confirmedRelationships.length === 0) {
					setError("No confirmed relationships found.")
				} else {
					setRelationshipIds(confirmedRelationships)
				}
			} catch (error: any) {
				setError(
					error.message || "An error occurred while fetching relationships."
				)
			} finally {
				setRelationshipsLoaded(true)
			}
		} else {
			setRelationshipsLoaded(true)
		}
	}

	const fetchLatestPosts = async () => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const postUrl =
				process.env.REACT_APP_POST_URL ||
				"https://cscloud8-85.lnu.se/tuTea/forum-service/api/v1/posts"
			const url = `${postUrl}/all-posts?sortOrder=newest`

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ relationshipIds }),
			})

			if (!response.ok) {
				const errorMessage = await response.text()
				setError(errorMessage)
				return
			}

			const data = await response.json()
			setPosts(data.slice(0, 5)) // Keep only the latest 5 posts
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	useEffect(() => {
		fetchRelationships()
	}, [])

	useEffect(() => {
		if (relationshipsLoaded) {
			fetchLatestPosts()
		}
	}, [relationshipsLoaded])

	const handleRedirect = () => {
		navigate("/forum")
	}

	return (
		<div className={styles.latestPostsContainer} onClick={handleRedirect}>
			<h2>Latest Posts</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<ul className={styles.postList}>
				{posts.map((post) => (
					<li key={post._id} className={styles.postItem}>
						<h3 className={styles.postTitle}>{post.title}</h3>
						<p className={styles.postDate}>
							{new Date(post.createdAt).toLocaleDateString()}
						</p>
					</li>
				))}
			</ul>
		</div>
	)
}

export default LatestPosts
