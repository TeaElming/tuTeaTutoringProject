/** @format */

import React from "react"
import styles from "./letter.module.css"

interface LetterProps {
	letter: string
	handleClick: () => void
	isChosen: boolean
	isIncluded: boolean
}

const Letter: React.FC<LetterProps> = ({
	letter,
	handleClick,
	isChosen,
	isIncluded,
}) => {
	let className = styles.letter
	if (isChosen) {
		className += ` ${styles.chosen}`
		className += isIncluded ? ` ${styles.included}` : ` ${styles.notIncluded}`
	}

	return (
		<div
			className={className}
			onClick={!isChosen ? handleClick : undefined}
			role="button"
			aria-disabled={isChosen}
		>
			{letter.toUpperCase()}
		</div>
	)
}

export default Letter
