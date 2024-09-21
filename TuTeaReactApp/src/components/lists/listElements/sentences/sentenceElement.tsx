/** @format */

import React from "react"
import styles from "./sentence.module.css"

interface Sentence {
	_id: string
	owner: string
	sentence: string
	semanticTranslation: string
	directTranslation: string
	__v: number
	added: Date
}

const SentenceElement: React.FC<{
	sentence: Sentence
	onClick: (id: string) => void
}> = ({ sentence, onClick }) => {
	return (
		<li className={styles.sentenceRow} onClick={() => onClick(sentence._id)}>
			<div className={styles.column}>{sentence.sentence}</div>
			<div className={styles.column}>{sentence.semanticTranslation}</div>
			<div className={styles.column}>{sentence.directTranslation}</div>
		</li>
	)
}

export default SentenceElement
