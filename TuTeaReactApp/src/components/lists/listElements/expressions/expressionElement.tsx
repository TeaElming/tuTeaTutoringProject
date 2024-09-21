/** @format */

import React from "react"
import styles from "./expression.module.css"

interface Expression {
	_id: string
	expression: string
	directTranslation: string
	meaning: string
	nativeEquivalent: string
	__v: number
	added: Date
}

const ExpressionElement: React.FC<{
	expression: Expression
	onClick: (id: string) => void
}> = ({ expression, onClick }) => {
	return (
		<li
			className={styles.expressionRow}
			onClick={() => onClick(expression._id)}
		>
			<div className={styles.column}>{expression.expression || "N/A"}</div>
			<div className={styles.column}>
				{expression.directTranslation || "N/A"}
			</div>
			<div className={styles.column}>{expression.meaning || "N/A"}</div>
			<div className={styles.column}>
				{expression.nativeEquivalent || "N/A"}
			</div>
		</li>
	)
}

export default ExpressionElement
