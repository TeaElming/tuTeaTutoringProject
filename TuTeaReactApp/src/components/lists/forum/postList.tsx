/** @format */

import React, { useState } from "react"
import PostElement from "./postElement"
import PaginationButtons from "../../buttons/paginationButton"
import SortPosts from "./sortPosts"
import UpdatePostModal from "./popUps/editPost"
import RespondToPostModal from "./popUps/respondToPost"
import styles from "./css/postList.module.css"

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

interface PostListProps {
	posts: Post[]
	error: string
	setSortOrder?: (sortOrder: string) => void // Make setSortOrder optional
	onPin: (id: string) => void // Update: only pass the post ID
	onFlag: (id: string) => void // Update: only pass the post ID
}

const PostList: React.FC<PostListProps> = ({
	posts,
	error,
	setSortOrder,
	onPin,
	onFlag,
}) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
	const [isResponseModalOpen, setIsResponseModalOpen] = useState<boolean>(false)
	const [postToEdit, setPostToEdit] = useState<Post | null>(null)
	const [postToRespond, setPostToRespond] = useState<Post | null>(null)

	const itemsPerPage = 10
	const totalPages = Math.ceil(posts.length / itemsPerPage)
	const currentPosts = posts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const handleEdit = (id: string) => {
		const post = posts.find((post) => post._id === id)
		if (post) {
			setPostToEdit(post)
			setIsEditModalOpen(true)
		}
	}

	const handleResponse = (id: string) => {
		const post = posts.find((post) => post._id === id)
		if (post) {
			setPostToRespond(post)
			setIsResponseModalOpen(true)
		}
	}

	const handlePostUpdated = () => {
		// Refresh posts list or update state after editing
		console.log("Post updated")
		setIsEditModalOpen(false)
		setIsResponseModalOpen(false)
	}

	return (
		<div className="postListDiv">
			<h2>Posts</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			{setSortOrder && <SortPosts setSortOrder={setSortOrder} />}
			<div className={styles.headerRow}>
				<div className={styles.column}>Title</div>
				<div className={styles.column}>Content</div>
				<div className={styles.column}>Date Added</div>
				<div className={styles.column}>Access</div>
				<div className={styles.column}>Actions</div>
			</div>
			<ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
				{currentPosts.map((post) => (
					<PostElement
						key={post._id}
						post={post}
						onFlag={onFlag}
						onPin={onPin}
						onEdit={handleEdit}
						onResponse={handleResponse}
					/>
				))}
			</ul>
			<PaginationButtons
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>

			{postToEdit && (
				<UpdatePostModal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					post={postToEdit}
					onPostUpdated={handlePostUpdated}
				/>
			)}

			{postToRespond && (
				<RespondToPostModal
					isOpen={isResponseModalOpen}
					onClose={() => setIsResponseModalOpen(false)}
					post={postToRespond}
					onPostUpdated={handlePostUpdated}
				/>
			)}
		</div>
	)
}

export default PostList
