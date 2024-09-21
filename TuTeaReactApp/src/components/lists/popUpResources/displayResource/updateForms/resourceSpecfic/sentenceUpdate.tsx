/** @format */

import React, { useState, useEffect } from "react"
import Button from "../../../../../buttons/plainButton"
import styles from "../../../../../forms/resources/css/sentence.module.css"

interface Sentence {
	_id: string
	sentence: string
	semanticTranslation: string
	directTranslation: string
	owner: string
	__v: number
	added: Date
}

interface SentenceUpdateProps {
	sentenceResource: Sentence // Correct the prop name to match usage
	handleOnClose: () => void
}

const SentenceForm: React.FC<SentenceUpdateProps> = ({
	sentenceResource: sentenceResource,
	handleOnClose,
}) => {
	const [sentence, setSentence] = useState(sentenceResource.sentence || "")
	const [semanticTranslation, setSemanticTranslation] = useState(
		sentenceResource.semanticTranslation || ""
	)
	const [directTranslation, setDirectTranslation] = useState(
		sentenceResource.directTranslation || ""
	)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	useEffect(() => {
		// Prefill form data when the component mounts or when the resource changes
		setSentence(sentenceResource.sentence)
		setSemanticTranslation(sentenceResource.semanticTranslation)
		setDirectTranslation(sentenceResource.directTranslation)
	}, [sentenceResource])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const sentenceData = {
			sentence: sentence || " ",
			semanticTranslation: semanticTranslation || " ",
			directTranslation: directTranslation || " ",
		}

		const sentenceUrl =
			process.env.REACT_APP_RESOURCES_SENTENCE_URL ||
			"https://cscloud8-85.lnu.se/tuTea/user-service/api/v1/sentences"

		const updateUrl = `${sentenceUrl}/${sentenceResource._id}`

		const token = sessionStorage.getItem("jwt")

		if (!token) {
			setError("Authorization token is missing. Please log in.")
			return
		}

		try {
			const response = await fetch(updateUrl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(sentenceData),
			})

			if (response.ok) {
				setSuccessMessage("Sentence updated successfully!")
				setError(null)

				// Close the form and refresh the page
				handleOnClose() // Close the form
				window.location.reload() // Refresh the page
			} else {
				const errorMessage = await response.text()
				setError(`Update failed: ${errorMessage}`)
				setSuccessMessage(null)
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(`Error updating sentence: ${error.message}`)
			} else {
				setError("An unknown error occurred.")
			}
			setSuccessMessage(null)
		}
	}

	const handleInputChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		const { name, value } = event.target
		if (name === "sentence") {
			setSentence(value)
		} else if (name === "semanticTranslation") {
			setSemanticTranslation(value)
		} else if (name === "directTranslation") {
			setDirectTranslation(value)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<div className={styles.formGroup}>
				<label htmlFor="sentence" className={styles.label}>
					Sentence
				</label>
				<textarea
					id="sentence"
					name="sentence"
					placeholder="Enter sentence..."
					value={sentence}
					onChange={handleInputChange}
					className={styles.textarea}
				/>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor="semanticTranslation" className={styles.label}>
					Semantic Translation
				</label>
				<textarea
					id="semanticTranslation"
					name="semanticTranslation"
					placeholder="Enter semantic translation..."
					value={semanticTranslation}
					onChange={handleInputChange}
					className={styles.textarea}
				/>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor="directTranslation" className={styles.label}>
					Direct Translation
				</label>
				<textarea
					id="directTranslation"
					name="directTranslation"
					placeholder="Enter direct translation..."
					value={directTranslation}
					onChange={handleInputChange}
					className={styles.textarea}
				/>
			</div>
			<Button type="submit" className={styles.button}>
				Update
			</Button>
			<Button type="button" onClick={handleOnClose} className={styles.button}>
				Cancel
			</Button>
			{error && <div className={styles.error}>{error}</div>}
			{successMessage && <div className={styles.success}>{successMessage}</div>}
		</form>
	)
}

export default SentenceForm
