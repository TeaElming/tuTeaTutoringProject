/** @format */

import React from "react"
import VocabularyElement from "../vocabs/vocabElement"
import SentenceElement from "../sentences/sentenceElement"
import GrammarElement from "../grammar/grammarElement"
import ExpressionElement from "../expressions/expressionElement"

interface Vocabulary {
	_id: string
	owner: string
	word: string
	translation: string[]
	wordGroup: string
	__v: number
	added: Date
}

interface Sentence {
	_id: string
	owner: string
	sentence: string
	semanticTranslation: string
	directTranslation: string
	__v: number
	added: Date
}

interface GrammarRule {
	_id: string
	owner: string
	rule: string
	description: string
	comment: string
	examples: any[]
	__v: number
	added: Date
}

interface Expression {
	_id: string
	owner: string
	expression: string
	directTranslation: string
	meaning: string
	nativeEquivalent: string
	__v: number
	added: Date
}

type Resource = Vocabulary | Sentence | GrammarRule | Expression // | Generic - yet to be added

const UnifiedResourceElement: React.FC<{
	resource: Resource
	onClick: (id: string) => void
}> = ({ resource, onClick }) => {
	const handleClick = () => onClick(resource._id)

	if ("word" in resource) {
		return (
			<div>
				<VocabularyElement onClick={handleClick} vocabulary={resource} />
			</div>
		)
	} else if ("sentence" in resource) {
		return (
			<div>
				<SentenceElement onClick={handleClick} sentence={resource} />
			</div>
		)
	} else if ("rule" in resource) {
		return (
			<div>
				<GrammarElement onClick={handleClick} grammarRule={resource} />
			</div>
		)
	} else if ("expression" in resource) {
		return (
			<div>
				<ExpressionElement onClick={handleClick} expression={resource} />
			</div>
		)
	} else {
		return null
	}
}

export default UnifiedResourceElement
