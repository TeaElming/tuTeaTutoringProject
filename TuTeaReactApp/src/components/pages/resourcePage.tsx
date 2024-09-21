/** @format */

import React, { useState } from "react"
import Button from "../buttons/plainButton"
import VocabularyList from "../lists/listElements/vocabs/vocabularyList"
import SentenceList from "../lists/listElements/sentences/sentenceList"
import GrammarList from "../lists/listElements/grammar/grammarList"
import ExpressionList from "../lists/listElements/expressions/expressionList"
import UnifiedResourceElement from "../lists/listElements/unified/unifiedResourceList"
import BulkUpload from "../fileHandlers/prefillResources/bulkUpload"
import AddResourceForm from "../forms/addResource"
import styles from "./css/resourcePage.module.css"

const ResourcePage: React.FC = () => {
	const [selectedResource, setSelectedResource] = useState<string>("Latest")
	const [showPopup, setShowPopup] = useState<boolean>(false)
	const [showBulkUploadPopup, setShowBulkUploadPopup] = useState<boolean>(false)

	const renderResource = () => {
		switch (selectedResource) {
			case "Latest":
				return <UnifiedResourceElement />
			case "Vocabulary":
				return <VocabularyList />
			case "Sentence":
				return <SentenceList />
			case "Grammatical-Rule":
				return <GrammarList />
			case "Expression":
				return <ExpressionList />
			default:
				return null
		}
	}

	// Function to close the popup
	const handleClosePopup = () => {
		setShowPopup(false)
    window.location.reload() // adding this because I have not implemented a webhook
	}

	return (
		<div className={styles.resourcePageContainer}>
			<div className={styles.buttonGroup}>
				<Button
					className={styles.addResourceButton}
					onClick={() => setShowPopup(true)}
				>
					Add Resource
				</Button>
				<button
					className={styles.bulkUploadButton}
					onClick={() => setShowBulkUploadPopup(true)}
				>
					⚡
				</button>
			</div>

			{showPopup && (
				<div className={styles.popupOverlay}>
					<div className={styles.popupContent}>
						<button
							className={styles.closeButton}
							onClick={() => setShowPopup(false)}
						>
							×
						</button>
						<AddResourceForm onClose={handleClosePopup} />{" "}
						{/* Pass the close handler */}
					</div>
				</div>
			)}

			{showBulkUploadPopup && (
				<div className={styles.popupOverlay}>
					<div className={styles.popupContent}>
						<button
							className={styles.closeButton}
							onClick={() => setShowBulkUploadPopup(false)}
						>
							×
						</button>
						<BulkUpload />
					</div>
				</div>
			)}

			<div className={styles.buttonContainer}>
				<Button
					className={styles.resourceButton}
					onClick={() => setSelectedResource("Latest")}
				>
					Latest
				</Button>
				<Button
					className={styles.resourceButton}
					onClick={() => setSelectedResource("Vocabulary")}
				>
					Vocabulary
				</Button>
				<Button
					className={styles.resourceButton}
					onClick={() => setSelectedResource("Sentence")}
				>
					Sentences
				</Button>
				<Button
					className={styles.resourceButton}
					onClick={() => setSelectedResource("Grammatical-Rule")}
				>
					Grammatical Rules
				</Button>
				<Button
					className={styles.resourceButton}
					onClick={() => setSelectedResource("Expression")}
				>
					Expressions
				</Button>
			</div>
			<div className={styles.resourceDisplayer}>{renderResource()}</div>
		</div>
	)
}

export default ResourcePage
