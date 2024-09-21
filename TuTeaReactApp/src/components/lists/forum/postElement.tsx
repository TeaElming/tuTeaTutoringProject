/** @format */

import React from "react"
import styles from "./css/postElement.module.css"

interface PostProps {
	post: {
		_id: string
		title: string
		content: string
		createdAt: string
		access: string
		pinned: boolean
		flagged: boolean
	}
	onFlag: (id: string) => void
	onPin: (id: string) => void
	onEdit: (id: string) => void
	onResponse: (id: string) => void // New function prop for commenting
}

const PostElement: React.FC<PostProps> = ({
	post,
	onFlag,
	onPin,
	onEdit,
	onResponse,
}) => {
	const truncatedContent =
		post.content.length > 30
			? post.content.substring(0, 30) + "..."
			: post.content

	return (
		<li className={styles.postRow}>
			<div className={styles.column}>{post.title}</div>
			<div className={styles.column}>{truncatedContent}</div>
			<div className={styles.column}>
				{new Date(post.createdAt).toLocaleString()}
			</div>
			<div className={styles.column}>{post.access}</div>
			<div className={styles.column}>
				<span onClick={() => onFlag(post._id)} style={{ cursor: "pointer" }}>
					{post.flagged ? "🚩" : "⚑"}
				</span>
				<span onClick={() => onPin(post._id)} style={{ cursor: "pointer" }}>
					{post.pinned ? "📌" : "📍"}
				</span>
				<span onClick={() => onEdit(post._id)} style={{ cursor: "pointer" }}>
					✎
				</span>
				<span
					onClick={() => onResponse(post._id)}
					style={{ cursor: "pointer" }}
				>
					💬
				</span>
			</div>
		</li>
	)
}

export default PostElement
