/** @format */
import React from "react"
import VocabUpdateForm from "./resourceSpecfic/vocabUpdate"
import SentenceUpdateForm from "./resourceSpecfic/sentenceUpdate"
import GrammaticalRuleUpdateForm from "./resourceSpecfic/grammarUpdate"
import ExpressionUpdateForm from "./resourceSpecfic/expressionUpdate"

interface BaseResource {
	_id: string
	owner: string
	__v: number
	added: Date
	// category field is no longer used for form selection
}

type Resource = BaseResource & {
	// Define common properties, and extend for specific resource types if needed
}

interface UpdateFormProps {
	resource: Resource
	resourceType: string
	onSave: () => void
	onCancel: () => void
}

const UpdateForm: React.FC<UpdateFormProps> = ({
	resource,
	resourceType,
	onSave,
	onCancel,
}) => {
	// Render the appropriate form based on the resourceType prop
	switch (resourceType) {
		case "Vocabulary":
		case "vocabularies":
			return (
				<VocabUpdateForm
					vocabResource={resource as any} // Cast to appropriate type if needed
					handleOnClose={onCancel}
				/>
			)

		case "Sentence":
		case "sentences":
			return (
				<SentenceUpdateForm
					sentenceResource={resource as any} // Ensure the correct prop name is used here
					handleOnClose={onCancel}
				/>
			)
		case "GrammarRule":
		case "gramatical-rules":
			return (
				<GrammaticalRuleUpdateForm
					grammarRuleResource={resource as any}
					handleOnClose={onCancel}
				/>
			)
		case "Expression":
		case "expressions":
			return (
				<ExpressionUpdateForm
					expressionResource={resource as any}
					handleOnClose={onCancel}
				/>
			)
		default:
			return <div>Unsupported resource type</div>
	}
}

export default UpdateForm
