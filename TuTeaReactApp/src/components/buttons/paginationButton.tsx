/** @format */

import React from "react"
import styles from "./paginationButton.module.css"

interface PaginationButtonsProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	return (
		<div className={styles.pagination}>
			<button
				className={styles.button}
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Previous
			</button>
			<span className={styles.pageInfo}>
				Page {currentPage} of {totalPages}
			</span>
			<button
				className={styles.button}
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</div>
	)
}

export default PaginationButtons
