/** @format */

import React from "react"
import styles from "./css/postFilter.module.css"

interface PostFilterProps {
	setFilter: (filter: string) => void
	onCreatePostClick: () => void
}

const PostFilter: React.FC<PostFilterProps> = ({
	setFilter,
	onCreatePostClick,
}) => {
	return (
		<div className={styles.filterContainer}>
			<button className={styles.filterButton} onClick={() => setFilter("all")}>
				View All
			</button>
			<button
				className={styles.filterButton}
				onClick={() => setFilter("public")}
			>
				View Public
			</button>
			<button
				className={styles.filterButton}
				onClick={() => setFilter("private")}
			>
				View Private
			</button>
			<button className={styles.filterButton} onClick={onCreatePostClick}>
				Create Post
			</button>
		</div>
	)
}

export default PostFilter
