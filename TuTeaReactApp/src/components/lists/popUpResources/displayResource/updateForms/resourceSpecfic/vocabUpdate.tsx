/** @format */

import React, { useState } from "react"
import Button from "../../../../../buttons/plainButton"
import styles from "../../../../../forms/resources/css/vocab.module.css"

interface Vocabulary {
	_id: string
	owner: string
	word: string
	translation: string[]
	wordGroup: string
	__v: number
	added: Date
}

interface VocabUpdateFormProps {
	vocabResource: Vocabulary
	handleOnClose: () => void
}

const VocabUpdateForm: React.FC<VocabUpdateFormProps> = ({
	vocabResource: vocab,
	handleOnClose,
}) => {
	const [word, setWord] = useState(vocab.word || "")
	const [translation, setTranslation] = useState(
		vocab.translation.join(", ") || ""
	)
	const [wordGroup, setWordGroup] = useState(vocab.wordGroup || "General")
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const vocabData = {
			word: word || " ",
			translation: translation.split(",").map((t) => t.trim()) || [],
			wordGroup: wordGroup || " ",
		}

		const vocabUrl =
			process.env.REACT_APP_RESOURCES_VOCAB_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/vocabularies"

		const updateUrl = `${vocabUrl}/${vocab._id}`

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
				body: JSON.stringify(vocabData),
			})

			if (response.ok) {
				setSuccessMessage("Vocabulary updated successfully!")
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
				setError(`Error updating vocabulary: ${error.message}`)
			} else {
				setError("An unknown error occurred.")
			}
			setSuccessMessage(null)
		}
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		if (name === "word") {
			setWord(value)
		} else if (name === "translation") {
			setTranslation(value)
		}
	}

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setWordGroup(event.target.value)
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<div className={styles.formGroup}>
				<label htmlFor="word" className={styles.label}>
					Word
				</label>
				<input
					id="word"
					type="text"
					name="word"
					placeholder="Enter word..."
					value={word}
					onChange={handleInputChange}
					className={styles.input}
				/>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor="translation" className={styles.label}>
					Translation
				</label>
				<input
					id="translation"
					type="text"
					name="translation"
					placeholder="Enter translation..."
					value={translation}
					onChange={handleInputChange}
					className={styles.input}
				/>
			</div>
			<div className={styles.radioGroup}>
				{/* Radio buttons for word groups */}
				{[
					"Adjective",
					"Adverb",
					"Conjunction",
					"General",
					"Interjection",
					"Noun",
					"Preposition",
					"Pronoun",
					"Verb",
				].map((group) => (
					<label key={group} className={styles.radioLabel}>
						<input
							type="radio"
							name="wordGroup"
							value={group}
							checked={wordGroup === group}
							onChange={handleRadioChange}
						/>
						{group}
					</label>
				))}
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

export default VocabUpdateForm
