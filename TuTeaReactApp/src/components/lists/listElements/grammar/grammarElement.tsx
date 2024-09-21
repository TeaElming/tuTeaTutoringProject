/** @format */

import React from "react"
import styles from "./grammar.module.css"

interface GrammarRule {
	_id: string
	rule: string
	description: string
	__v: number
	added: Date
}

const GrammarElement: React.FC<{
	grammarRule: GrammarRule
	onClick: (id: string) => void
}> = ({ grammarRule: rule, onClick }) => {
	return (
		<li className={styles.grammarRow} onClick={() => onClick(rule._id)}>
			<div className={styles.column}>{rule.rule}</div>
			<div className={styles.column}>{rule.description}</div>
		</li>
	)
}

export default GrammarElement
