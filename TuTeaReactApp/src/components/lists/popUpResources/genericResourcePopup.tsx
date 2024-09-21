/** @format */
import React, { useState } from "react"
import styles from "./css/genericResourcePopup.module.css"
import DisplayResource from "./displayResource/displayResource"
import UpdateForm from "./displayResource/updateForms/updateForm"
import ConfirmDelete from "./confirmDelete"
import ExampleForm from "./addExmple/exampleForm"
import ExampleList from "./examples/exampleList"

interface Example {
	_id: string
	exampleTarget: string
	exampleNative: string
	targetLanguage: string
	nativeLanguage?: string
	comments?: string
}

interface ExampleFormData {
	exampleTarget: string
	exampleNative: string
	targetLanguage: string
	nativeLanguage?: string
	comments?: string
}

interface ResourcePopupProps {
	resource: any // Consider using a more specific type here if possible
	resourceType: string
	onClose: () => void
}

const ResourcePopup: React.FC<ResourcePopupProps> = ({
	resource,
	resourceType,
	onClose,
}) => {
	const [editMode, setEditMode] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [showExampleForm, setShowExampleForm] = useState(false)
	const [showExampleList, setShowExampleList] = useState(false)
	const [examples, setExamples] = useState<Example[]>([])
	const [selectedExample, setSelectedExample] = useState<Example | null>(null)

	const baseResourceUrl =
		process.env.REACT_APP_RESOURCES_URL ||
		"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/"

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

	// Fetch the correct base URL based on the resource type
	const resourceUrl = urlMap[resourceType]

	// Validation check to ensure the resource URL is defined
	if (!resourceUrl) {
		console.error(
			`Unknown resource type: ${resourceType}. Please check the mapping.`
		)
	}

	// Centralized function to close popup and refresh the page
	const handleClosePopup = () => {
		onClose()
		window.location.reload() // Reload the page to reflect changes
	}

	const fetchExamples = async () => {
		if (!resourceUrl) {
			console.error(
				`Unknown resource type: ${resourceType}. Cannot construct the URL.`
			)
			return
		}

		try {
			const response = await fetch(`${resourceUrl}/${resource._id}/examples`, {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				setExamples(data)
			} else {
				const errorText = await response.text()
				throw new Error(errorText || "Unknown error")
			}
		} catch (error) {
			console.error("Error fetching examples:", error)
		}
	}

	const handleEdit = () => setEditMode(true)
	const handleSave = () => {
		setEditMode(false)
		handleClosePopup() // Ensure popup closes and refreshes
	}
	const handleCancel = () => setEditMode(false)
	const handleDelete = () => setShowDeleteConfirm(true)
	const handleConfirmDelete = () => {
		setShowDeleteConfirm(false)
		handleClosePopup() // Close and refresh on delete confirm
	}
	const handleCancelDelete = () => setShowDeleteConfirm(false)

	const handleAddExample = () => {
		setSelectedExample(null) // Clear selected example for creation mode
		setShowExampleForm(true)
	}

	const handleEditExample = (example: Example) => {
		setSelectedExample(example)
		setShowExampleForm(true)
	}

	const handleDeleteExample = async (exampleId: string) => {
		if (!resourceUrl) {
			alert(`Unknown resource type: ${resourceType}. Cannot construct the URL.`)
			return
		}

		// Construct the delete URL
		const url = `${resourceUrl}/${resource._id}/examples/${exampleId}`

		// Log the URL and resource type to ensure they are correct
		console.log("Attempting to delete example...")
		console.log("Delete URL:", url)
		console.log("Resource Type:", resourceType)

		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${sessionStorage.getItem("jwt")}`, // Adjust if JWT is stored differently
				},
			})

			// Log the response status and text
			console.log("Response Status:", response.status)

			if (response.ok) {
				setExamples(examples.filter((ex) => ex._id !== exampleId))
				alert("Example deleted successfully!")
				handleClosePopup() // Trigger close and refresh on successful delete
			} else {
				const errorText = await response.text()
				console.error("Error Response Text:", errorText)
				throw new Error(errorText || "Unknown error")
			}
		} catch (error) {
			console.error("Error deleting example:", error)
			alert(`Failed to delete example: ${error}`)
		}
	}

	const handleSaveExample = async (formData: ExampleFormData) => {
		if (!resourceUrl) {
			alert(`Unknown resource type: ${resourceType}. Cannot construct the URL.`)
			return
		}

		const url = selectedExample
			? `${resourceUrl}/${resource._id}/examples/${selectedExample._id}`
			: `${resourceUrl}/${resource._id}/examples`

		const method = selectedExample ? "PUT" : "POST"

		// Log the request details
		console.log("Saving example...")
		console.log("Request URL:", url)
		console.log("Request Method:", method)
		console.log("Request Headers:", {
			"Content-Type": "application/json",
			Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
		})
		console.log("Request Body:", formData)

		try {
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${sessionStorage.getItem("jwt")}`, // Adjust if JWT is stored differently
				},
				body: JSON.stringify(formData),
			})

			// Log the response status and data
			console.log("Response Status:", response.status)

			if (response.ok) {
				const updatedExample = await response.json()
				console.log("Response Data:", updatedExample)

				if (selectedExample) {
					// Update the example in the list
					setExamples((prev) =>
						prev.map((ex) =>
							ex._id === updatedExample._id ? updatedExample : ex
						)
					)
				} else {
					// Add the new example to the list if it doesn't already exist
					setExamples((prev) => {
						const isDuplicate = prev.some((ex) => ex._id === updatedExample._id)
						return isDuplicate ? prev : [...prev, updatedExample]
					})
				}
				setShowExampleForm(false)
				alert(
					`Example ${selectedExample ? "updated" : "created"} successfully!`
				)
				handleClosePopup() // Close and refresh on example save
			} else {
				const errorText = await response.text()
				console.error("Error Response Text:", errorText)
				throw new Error(errorText || "Unknown error")
			}
		} catch (error) {
			console.error("Error saving example:", error)
			alert(
				`Failed to ${selectedExample ? "update" : "create"} example: ${error}`
			)
		}
	}

	const handleViewAllExamples = () => {
		fetchExamples()
		setShowExampleList(true)
	}

	const handleCloseExampleList = () => setShowExampleList(false)

	return (
		<div className={styles.popupContainer}>
			<div className={styles.popupContent} id={resource._id}>
				<h3>Detailed View of Resource</h3>
				{!editMode && !showExampleForm && !showExampleList ? (
					<>
						<DisplayResource resource={resource} />
						<div className={styles.buttonContainer}>
							<button onClick={handleEdit} className={styles.button}>
								Edit
							</button>
							<button onClick={handleAddExample} className={styles.button}>
								Add Example
							</button>
							<button onClick={handleViewAllExamples} className={styles.button}>
								View All Examples
							</button>
							<button onClick={handleDelete} className={styles.button}>
								Delete
							</button>
						</div>
						<button onClick={onClose} className={styles.closeButton}>
							Close
						</button>
					</>
				) : editMode ? (
					<UpdateForm
						resource={resource}
						resourceType={resourceType}
						onSave={handleSave}
						onCancel={handleCancel}
					/>
				) : showExampleForm ? (
					<ExampleForm
						example={selectedExample}
						resourceType={resourceType}
						resourceId={resource._id}
						onSubmit={handleSaveExample}
						onCancel={() => setShowExampleForm(false)}
					/>
				) : showExampleList ? (
					<ExampleList
						exampleIds={resource.examples} // Pass the list of example IDs
						resourceUrl={`${resourceUrl}/${resource._id}/examples`} // Pass the correct URL for fetching examples
						onAdd={handleAddExample}
						onEdit={handleEditExample}
						onDelete={handleDeleteExample}
						onClose={handleCloseExampleList}
					/>
				) : null}
				{showDeleteConfirm && (
					<ConfirmDelete
						resourceType={resourceType}
						resourceId={resource._id}
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
					/>
				)}
			</div>
		</div>
	)
}

export default ResourcePopup
