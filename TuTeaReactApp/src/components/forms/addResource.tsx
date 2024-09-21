/** @format */

import React, { useState } from "react"
import VocabForm from "./resources/vocabForm"
import SentenceForm from "./resources/sentenceForm"
import GrammarForm from "./resources/grammarForm"
import ExpressionForm from "./resources/expressionForm"
import "./css/AddResources.css" // Assuming this file contains your CSS

interface AddResourceFormProps {
	onClose: () => void; // Prop to handle closing the form on success
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ onClose }) => {
	const [selectedResource, setSelectedResource] = useState<string>("Vocabulary")

	const renderResource = () => {
		switch (selectedResource) {
			case "Vocabulary":
				return <VocabForm onSuccess={onClose} /> // Pass the close handler to the form
			case "Sentence":
				return <SentenceForm onSuccess={onClose} /> // Pass the close handler to the form
			case "Grammatical-Rule":
				return <GrammarForm onSuccess={onClose} /> // Pass the close handler to the form
			case "Expression":
				return <ExpressionForm onSuccess={onClose} /> // Pass the close handler to the form
			default:
				return null
		}
	}

	return (
		<div className="plainFormContainer">
			<div className="buttonGroup">
				<button
					onClick={() => setSelectedResource("Vocabulary")}
					className={`top-button ${
						selectedResource === "Vocabulary" ? "selected" : ""
					}`}
				>
					Vocabulary
				</button>
				<button
					onClick={() => setSelectedResource("Sentence")}
					className={`top-button ${
						selectedResource === "Sentence" ? "selected" : ""
					}`}
				>
					Sentence
				</button>
				<button
					onClick={() => setSelectedResource("Grammatical-Rule")}
					className={`top-button ${
						selectedResource === "Grammatical-Rule" ? "selected" : ""
					}`}
				>
					Grammatical Rule
				</button>
				<button
					onClick={() => setSelectedResource("Expression")}
					className={`top-button ${
						selectedResource === "Expression" ? "selected" : ""
					}`}
				>
					Expression
				</button>
			</div>
			{renderResource()}
		</div>
	)
}

export default AddResourceForm
