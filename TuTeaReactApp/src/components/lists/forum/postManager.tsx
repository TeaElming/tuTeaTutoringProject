/** @format */

import React, { useState, useEffect } from "react"
import ForumWebhookListener from "./forumWebhookListener"
import PostList from "./postList"
import PostFilter from "./postFilter"
import ActionFilter from "./actionFilter" // Import the ActionFilter component
import CreatePostModal from "./popUps/createPostModal"
import RelationshipSelector from "./relationshipSelector"
import styles from "./css/postManager.module.css"

interface Post {
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

const PostManager: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([])
	const [error, setError] = useState<string>("")
	const [filter, setFilter] = useState<string>("all")
	const [relationships, setRelationships] = useState<string[]>([])
	const [relationshipsLoaded, setRelationshipsLoaded] = useState<boolean>(false)
	const [sortOrder, setSortOrder] = useState<string>("newest")
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [showPinned, setShowPinned] = useState<boolean>(false)
	const [showFlagged, setShowFlagged] = useState<boolean>(false)

	const postUrl =
		process.env.REACT_APP_FORUM_URL ||
		"https://cscloud8-85.lnu.se/tuTea/forum-service/api/v1"

	const handlePin = async (id: string) => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return
			}

			// Find the post by ID to check current pinned state
			const post = posts.find((post) => post._id === id)
			if (!post) {
				setError("Post not found.")
				return
			}

			const url = `${postUrl}/posts/${id}/${post.pinned ? "unpin" : "pin"}`

			console.log("Pin/Unpin URL:", url)

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error(`Failed to ${post.pinned ? "unpin" : "pin"} post.`)
			}

			// Toggle the pinned state
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === id ? { ...post, pinned: !post.pinned } : post
				)
			)
		} catch (error: any) {
			setError(error.message)
		}
	}

	const handleFlag = async (id: string) => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return
			}

			// Find the post by ID to check current flagged state
			const post = posts.find((post) => post._id === id)
			if (!post) {
				setError("Post not found.")
				return
			}

			const url = `${postUrl}/posts/${id}/${post.flagged ? "unflag" : "flag"}`

			console.log("Flag/Unflag URL:", url)

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error(`Failed to ${post.flagged ? "unflag" : "flag"} post.`)
			}

			// Toggle the flagged state
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === id ? { ...post, flagged: !post.flagged } : post
				)
			)
		} catch (error: any) {
			setError(error.message)
		}
	}

	const fetchRelationships = async () => {
		const userId = sessionStorage.getItem("currentUserId")
		const jwtToken = sessionStorage.getItem("jwt")

		if (userId && jwtToken) {
			try {
				console.log("Fetching relationships...")
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
				console.log("Fetched relationships data:", data)

				const confirmedRelationships = data
					.filter((relationship) => relationship.status === "confirmed")
					.map((relationship) => relationship._id)

				console.log("Confirmed relationship IDs:", confirmedRelationships)

				if (confirmedRelationships.length === 0) {
					setError("No confirmed relationships found.")
				} else {
					setRelationships(confirmedRelationships)
				}
			} catch (error: any) {
				console.error("Error while fetching relationships:", error.message)
				setError(
					error.message || "An error occurred while fetching relationships."
				)
			} finally {
				setRelationshipsLoaded(true) // Set relationshipsLoaded to true after fetch is done
			}
		} else {
			console.warn("User ID or JWT token is missing")
			setRelationshipsLoaded(true) // Set relationshipsLoaded to true even if IDs are missing
		}
	}

	const fetchPostActions = async (postId: string) => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return { pinned: false, flagged: false }
			}

			const response = await fetch(`${postUrl}/posts/${postId}/actions`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error(`Failed to fetch actions for post ${postId}`)
			}

			const actions = await response.json()
			return actions
		} catch (error: any) {
			setError(error.message)
			return { pinned: false, flagged: false } // Return default actions on error
		}
	}
	const fetchPinnedPosts = async () => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) return

			const response = await fetch(`${postUrl}/posts/pinned`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				const pinnedIds = data.map((item: { postId: string }) => item.postId)
			} else {
				throw new Error("Failed to fetch pinned posts.")
			}
		} catch (error: any) {
			setError(error.message)
		}
	}

	const fetchFlaggedPosts = async () => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) return

			const response = await fetch(`${postUrl}/posts/flagged`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				console.log("Flagged posts data: ", data)
				const flaggedIds = data.map((item: { postId: string }) => item.postId)
				console.log("Flaged post ids: ", flaggedIds)
			} else {
				throw new Error("Failed to fetch flagged posts.")
			}
		} catch (error: any) {
			setError(error.message)
		}
	}

	const fetchPosts = async () => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return
			}

			let url = `${postUrl}/posts/public?sortOrder=${sortOrder}`
			let method = "GET"
			let body = null

			// Adjust URL and method based on the filter type
			if (filter === "private") {
				url = `${postUrl}/posts/private?sortOrder=${sortOrder}`
				method = "POST"
				body = JSON.stringify({ relationshipIds: relationships })
			} else if (filter === "all") {
				url = `${postUrl}/posts/all-posts?sortOrder=${sortOrder}`
				method = "POST"
				body = JSON.stringify({ relationshipIds: relationships })
			}

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body,
			})

			if (!response.ok) {
				const errorMessage = await response.text()
				setError(errorMessage)
				return
			}

			const data = await response.json()
			const postsWithActions = await Promise.all(
				data.map(async (post: Post) => {
					const actions = await fetchPostActions(post._id)
					return { ...post, ...actions }
				})
			)

			// Filter posts based on pinned and flagged settings
			let filteredPosts = postsWithActions

			if (showPinned) {
				filteredPosts = filteredPosts.filter((post) => post.pinned)
			}

			if (showFlagged) {
				filteredPosts = filteredPosts.filter((post) => post.flagged)
			}

			// Sort posts to have pinned posts at the top
			const sortedPosts = filteredPosts.sort((a, b) => {
				if (a.pinned && !b.pinned) return -1
				if (!a.pinned && b.pinned) return 1
				return 0
			})

			setPosts(sortedPosts)
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	useEffect(() => {
		fetchRelationships() // Fetch relationship IDs on mount
	}, [])

	useEffect(() => {
		if (relationshipsLoaded) {
			fetchPosts() // Fetch posts only after relationships are loaded
		}
	}, [
		filter,
		relationships,
		sortOrder,
		relationshipsLoaded,
		showPinned,
		showFlagged,
	])

	const handleShowPinnedChange = (showPinned: boolean) => {
		setShowPinned(showPinned)
	}

	const handleShowFlaggedChange = (showFlagged: boolean) => {
		setShowFlagged(showFlagged)
	}

	const handleWebhookEvent = (event: any) => {
		console.log("Handling Webhook event:", event)
		fetchPosts()
	}

	const handlePostCreated = () => {
		fetchPosts()
		setIsModalOpen(false) // Close the modal after post creation
	}

	const handleCreatePostClick = () => {
		setIsModalOpen(true)
	}

	return (
		<div className={styles.postManagerContainer}>
			<PostFilter
				setFilter={setFilter}
				onCreatePostClick={handleCreatePostClick}
			/>
			<ActionFilter
				setPosts={setPosts}
				postServiceUrl={postUrl}
				onShowPinnedChange={handleShowPinnedChange}
				onShowFlaggedChange={handleShowFlaggedChange}
			/>
			{filter === "private" && (
				<RelationshipSelector setRelationships={setRelationships} />
			)}
			<ForumWebhookListener onEvent={handleWebhookEvent} />
			<PostList
				posts={posts}
				error={error}
				setSortOrder={setSortOrder}
				onPin={handlePin}
				onFlag={handleFlag}
			/>
			<CreatePostModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onPostCreated={handlePostCreated}
			/>
		</div>
	)
}

export default PostManager
