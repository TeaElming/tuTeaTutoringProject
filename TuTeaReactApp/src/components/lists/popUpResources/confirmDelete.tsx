/** @format */

import React from "react"
import styles from "./css/confirmDelete.module.css" // Ensure this CSS module exists

interface ConfirmDeleteProps {
	resourceType: string
	resourceId: string
	onConfirm: () => void
	onCancel: () => void
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
	resourceType,
	resourceId,
	onConfirm,
	onCancel,
}) => {
	const handleDelete = async () => {
		// Define the base URL and specific URLs based on resource type
		const baseResourceUrl =
			process.env.REACT_APP_RESOURCES_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/"

		// Map resource types to their corresponding URL paths
    const urlMap: { [key: string]: string } = {
      Expression:
        process.env.REACT_APP_RESOURCES_EXPRESSION_URL ||
        `${baseResourceUrl}expressions`,
      expressions:
        process.env.REACT_APP_RESOURCES_EXPRESSION_URL ||
        `${baseResourceUrl}expressions`,
      Generic:
        process.env.REACT_APP_RESOURCES_GENERIC_URL ||
        `${baseResourceUrl}generic-resources`,
      "generic-resources":
        process.env.REACT_APP_RESOURCES_GENERIC_URL ||
        `${baseResourceUrl}generic-resources`,
      GrammarRule:
        process.env.REACT_APP_RESOURCES_GRAMMAR_URL ||
        `${baseResourceUrl}grammatical-rules`,
      "grammatical-rules":
        process.env.REACT_APP_RESOURCES_GRAMMAR_URL ||
        `${baseResourceUrl}grammatical-rules`,
      Sentence:
        process.env.REACT_APP_RESOURCES_SENTENCE_URL ||
        `${baseResourceUrl}sentences`,
      sentences:
        process.env.REACT_APP_RESOURCES_SENTENCE_URL ||
        `${baseResourceUrl}sentences`,
      Vocabulary:
        process.env.REACT_APP_RESOURCES_VOCAB_URL ||
        `${baseResourceUrl}vocabularies`,
      vocabularies:
        process.env.REACT_APP_RESOURCES_VOCAB_URL ||
        `${baseResourceUrl}vocabularies`,
      "unified-resources":
        process.env.REACT_APP_RESOURCES_UNIFIED_URL ||
        `${baseResourceUrl}unified-resources`,
    }

		// Determine the DELETE URL, ensuring no undefined segments
		const deleteUrl = urlMap[resourceType]

		// Check if the URL exists in the map; otherwise, show an error
		if (!deleteUrl) {
			alert(`Unknown resource type: ${resourceType}`)
			return
		}

		try {
			const token = sessionStorage.getItem("jwt")

			if (!token) {
				alert("Authorization token is missing. Please log in.")
				return
			}

			const response = await fetch(`${deleteUrl}/${resourceId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.ok) {
				alert("Resource deleted successfully!")
				onConfirm() // Close the confirm delete and main popup
			} else {
				const errorMessage = await response.text()
				alert(`Deletion failed: ${errorMessage}`)
			}
		} catch (error) {
			alert(`Error deleting resource: ${error}`)
		}
	}

	return (
		<div className={styles.confirmDeleteContainer}>
			<div className={styles.confirmDeleteContent}>
				<p>Are you sure you want to delete this {resourceType} resource?</p>
				<div className={styles.buttonContainer}>
					<button onClick={handleDelete} className={styles.button}>
						Yes
					</button>
					<button onClick={onCancel} className={styles.button}>
						No
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmDelete
