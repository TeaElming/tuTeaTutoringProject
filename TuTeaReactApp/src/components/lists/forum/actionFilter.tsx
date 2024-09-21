/** @format */

// ActionFilter.tsx

import React, { useState } from "react"
import styles from "./css/actionFilter.module.css" // Import the CSS module

interface ActionFilterProps {
	setPosts: React.Dispatch<React.SetStateAction<Post[]>>
	postServiceUrl: string
	onShowPinnedChange: (showPinned: boolean) => void // Handler for pinned
	onShowFlaggedChange: (showFlagged: boolean) => void // Handler for flagged
}

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

const ActionFilter: React.FC<ActionFilterProps> = ({
	setPosts,
	postServiceUrl,
	onShowPinnedChange,
	onShowFlaggedChange,
}) => {
	const [showPinned, setShowPinned] = useState<boolean>(false)
	const [showFlagged, setShowFlagged] = useState<boolean>(false)

	const handleShowPinnedChange = () => {
		const newShowPinned = !showPinned
		setShowPinned(newShowPinned)
		onShowPinnedChange(newShowPinned)
	}

	const handleShowFlaggedChange = () => {
		const newShowFlagged = !showFlagged
		setShowFlagged(newShowFlagged)
		onShowFlaggedChange(newShowFlagged)
	}

	return (
		<div className={styles.actionFilterContainer}>
			<label className={styles.actionFilterLabel}>
				<input
					type="checkbox"
					checked={showPinned}
					onChange={handleShowPinnedChange}
					className={styles.actionFilterInput}
				/>
				Show Pinned Posts
			</label>
			<label className={styles.actionFilterLabel}>
				<input
					type="checkbox"
					checked={showFlagged}
					onChange={handleShowFlaggedChange}
					className={styles.actionFilterInput}
				/>
				Show Flagged Posts
			</label>
		</div>
	)
}

export default ActionFilter
