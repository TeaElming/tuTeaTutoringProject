/** @format */

import React, { useState } from "react"
import Button from "../../buttons/plainButton" // Assuming this is the updated Button
import styles from "./css/sentence.module.css" // Importing the CSS module

interface SentenceFormProps {
	onSuccess: () => void // Prop to handle success action
}

const SentenceForm: React.FC<SentenceFormProps> = ({ onSuccess }) => {
	const [sentence, setSentence] = useState("")
	const [semanticTranslation, setSemanticTranslation] = useState("")
	const [directTranslation, setDirectTranslation] = useState("")
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevent the default form submission behavior

		const sentenceData = {
			sentence: sentence || " ",
			semanticTranslation: semanticTranslation || " ",
			directTranslation: directTranslation || " ",
		}

		const sentenceUrl =
			process.env.REACT_APP_RESOURCES_SENTENCE_URL ||
			"https://cscloud8-85.lnu.se/tuTea/user-service/api/v1/sentences"

		const token = sessionStorage.getItem("jwt")

		if (!token) {
			setError("Authorization token is missing. Please log in.")
			return
		}

		try {
			const response = await fetch(sentenceUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(sentenceData),
			})

			if (response.ok) {
				console.log("Form submitted successfully!")
				setSentence("")
				setSemanticTranslation("")
				setDirectTranslation("")
				setError(null)
				onSuccess() // Call onSuccess to close the popup after a successful submission
			} else {
				const errorMessage = await response.text()
				setError(`Form submission failed: ${errorMessage}`)
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(`Error submitting form: ${error.message}`)
			} else {
				setError("An unknown error occurred.")
			}
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
				Submit
			</Button>
			{error && <div className={styles.error}>{error}</div>}
		</form>
	)
}

export default SentenceForm
