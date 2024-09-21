/** @format */
import React, { useEffect, useState } from "react"
import ExampleElement from "./exampleElement"
import styles from "./css/exampleList.module.css"

interface ExampleListProps {
	exampleIds: string[] // Initially receive just the IDs
	resourceUrl: string // The base URL for the resource
	onAdd: () => void
	onEdit: (example: any) => void
	onDelete: (exampleId: string) => void
	onClose: () => void
}

const ExampleList: React.FC<ExampleListProps> = ({
	exampleIds,
	resourceUrl,
	onAdd,
	onEdit,
	onDelete,
	onClose,
}) => {
	const [examples, setExamples] = useState<any[]>([])

	// Fetch full example data based on IDs
	useEffect(() => {
		const fetchExamples = async () => {
			try {
				// Fetch all examples by ID
				const exampleData = await Promise.all(
					exampleIds.map(async (id) => {
						const response = await fetch(`${resourceUrl}/${id}`, {
							headers: {
								Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
							},
						})
						if (response.ok) {
							return await response.json()
						} else {
							throw new Error(`Failed to fetch example with ID: ${id}`)
						}
					})
				)
        console.log("Examples: ", exampleData)
				setExamples(exampleData) // Set the full example data
			} catch (error) {
				console.error("Error fetching examples:", error)
				alert(`Failed to fetch examples: ${error}`)
			}
		}

		fetchExamples()
	}, [exampleIds, resourceUrl])

	return (
		<div className={styles.exampleListContainer}>
			<h3>Examples</h3>
			{examples.length > 0 ? (
				examples.map((example) => (
					<ExampleElement
						key={example._id}
						example={example}
						resourceUrl={resourceUrl}
						onEdit={onEdit}
						onDelete={onDelete}
						onClose={onClose}
					/>
				))
			) : (
				<p>No examples added yet.</p>
			)}
			<div className={styles.buttonContainer}>
				<button onClick={onAdd} className={styles.button}>
					Add Example
				</button>
				<button onClick={onClose} className={styles.button}>
					Close
				</button>
			</div>
		</div>
	)
}

export default ExampleList
