/** @format */

import React from "react"
import styles from "./css/sortPosts.module.css"

interface SortPostsProps {
	setSortOrder: (sortOrder: string) => void
}

const SortPosts: React.FC<SortPostsProps> = ({ setSortOrder }) => {
	const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(event.target.value)
	}

	return (
		<div className={styles.sortContainer}>
			<label htmlFor="sortOrder" className={styles.sortLabel}>
				Sort by:
			</label>
			<select
				id="sortOrder"
				className={styles.sortSelect}
				onChange={handleSortChange}
			>
				<option value="newest">Newest</option>
				<option value="oldest">Oldest</option>
				<option value="alphabetical">Alphabetical</option>
				<option value="reverse-alphabetical">Reverse Alphabetical</option>
			</select>
		</div>
	)
}

export default SortPosts
