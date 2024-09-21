/** @format */

import React from "react"
import styles from "./manToHang.module.css"

interface ManToHangProps {
	wrongGuesses: number
}

const ManToHang: React.FC<ManToHangProps> = ({ wrongGuesses }) => {
	const stages = [
		`
       -----
       |   |
           |
           |
           |
           |
    =========`,
		`
       -----
       |   |
       O   |
           |
           |
           |
    =========`,
		`
       -----
       |   |
       O   |
       |   |
           |
           |
    =========`,
		`
       -----
       |   |
       O   |
      /|   |
           |
           |
    =========`,
		`
       -----
       |   |
       O   |
      /|\\  |
           |
           |
    =========`,
		`
       -----
       |   |
       O   |
      /|\\  |
      /    |
           |
    =========`,
		`
       -----
       |   |
       O   |
      /|\\  |
      / \\  |
           |
    =========`,
	]

	return (
		<div className={styles.hangmanContainer}>
			<div className={styles.hangmanStages}>{stages[wrongGuesses]}</div>
		</div>
	)
}

export default ManToHang
