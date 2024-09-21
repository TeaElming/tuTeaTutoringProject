/** @format */

import React from "react"

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

type Resource = Vocabulary | Sentence | GrammarRule | Expression

const DisplayResource: React.FC<{ resource: Resource }> = ({ resource }) => {
	const renderVocabulary = (vocabulary: Vocabulary) => (
		<div>
			<h3>Vocabulary</h3>
			<p>Word: {vocabulary.word}</p>
			<p>Translation: {vocabulary.translation.join(", ")}</p>
			<p>Word Group: {vocabulary.wordGroup}</p>
		</div>
	)

	const renderSentence = (sentence: Sentence) => (
		<div>
			<h3>Sentence</h3>
			<p>Sentence: {sentence.sentence}</p>
			<p>Semantic Translation: {sentence.semanticTranslation}</p>
			<p>Direct Translation: {sentence.directTranslation}</p>
		</div>
	)

	const renderGrammarRule = (grammarRule: GrammarRule) => (
		<div>
			<h3>Grammar Rule</h3>
			<p>Rule: {grammarRule.rule}</p>
			<p>Description: {grammarRule.description}</p>
			<p>Comment: {grammarRule.comment}</p>
			<p>
				Examples:{" "}
				{grammarRule.examples.map((ex, i) => (
					<li key={i}>{ex}</li>
				))}
			</p>
		</div>
	)

	const renderExpression = (expression: Expression) => (
		<div>
			<h3>Expression</h3>
			<p>Expression: {expression.expression}</p>
			<p>Direct Translation: {expression.directTranslation}</p>
			<p>Meaning: {expression.meaning}</p>
			<p>Native Equivalent: {expression.nativeEquivalent}</p>
		</div>
	)

	if ("word" in resource) {
		return renderVocabulary(resource)
	} else if ("sentence" in resource) {
		return renderSentence(resource)
	} else if ("rule" in resource) {
		return renderGrammarRule(resource)
	} else if ("expression" in resource) {
		return renderExpression(resource)
	}

	return <div>Resource type is not recognized</div>
}

export default DisplayResource
