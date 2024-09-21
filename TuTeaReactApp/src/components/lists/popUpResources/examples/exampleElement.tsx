/** @format */
import React from "react"
import styles from "./css/exampleElement.module.css"

interface ExampleElementProps {
	example: any
	resourceUrl: string // Pass resourceUrl as prop to form the correct GET request URL
	onEdit: (example: any) => void
	onDelete: (exampleId: string) => void
	onClose: () => void
}

const ExampleElement: React.FC<ExampleElementProps> = ({
	example,
	resourceUrl,
	onEdit,
	onDelete,
	onClose,
}) => {
	const handleEdit = async () => {
		try {
			// Fetch the full example details by ID
			const response = await fetch(`${resourceUrl}/${example._id}`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
				},
			})

			if (response.ok) {
				const fullExample = await response.json()
				onEdit(fullExample) // Pass the full example details to the edit handler
			} else {
				const errorText = await response.text()
				throw new Error(errorText || "Unknown error fetching example details.")
			}
		} catch (error) {
			console.error("Error fetching example details:", error)
			alert(`Failed to fetch example details: ${error}`)
		}
	}

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this example?")) {
			onDelete(example._id)
		}
	}

	return (
		<div className={styles.exampleContainer}>
			<h4>
				{example.exampleTarget} - {example.exampleNative}
			</h4>
			<p>Target Language: {example.targetLanguage}</p>
			<p>Native Language: {example.nativeLanguage}</p>
			<p>Comments: {example.comments}</p>
			<div className={styles.buttonContainer}>
				<button onClick={handleEdit} className={styles.button}>
					Edit
				</button>
				<button onClick={handleDelete} className={styles.button}>
					Delete
				</button>
				<button onClick={onClose} className={styles.button}>
					Close
				</button>
			</div>
		</div>
	)
}

export default ExampleElement
