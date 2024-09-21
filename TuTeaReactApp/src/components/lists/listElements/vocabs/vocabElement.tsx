/** @format */

import React from "react"
import styles from "./vocab.module.css"

interface Vocabulary {
	_id: string
	owner: string
	word: string
	translation: string[]
	wordGroup: string
	__v: number
	added: Date
}

const VocabularyElement: React.FC<{
	vocabulary: Vocabulary
	onClick: () => void
}> = ({ vocabulary, onClick }) => {
	return (
		<li className={styles.vocabularyRow} key={vocabulary._id} onClick={onClick}>
			<div className={styles.column}>{vocabulary.word}</div>
			<div className={styles.column}>{vocabulary.translation.join(", ")}</div>
			<div className={styles.column}>{vocabulary.wordGroup}</div>
		</li>
	)
}

export default VocabularyElement
