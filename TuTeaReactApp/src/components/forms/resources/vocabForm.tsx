/** @format */

import React, { useState } from "react"
import Button from "../../buttons/plainButton" // Assuming this is the updated Button
import styles from "./css/vocab.module.css" // Importing the CSS module

interface VocabFormProps {
	onSuccess: () => void // Prop to handle success action
}

const VocabForm: React.FC<VocabFormProps> = ({ onSuccess }) => {
	const [word, setWord] = useState("")
	const [translation, setTranslation] = useState("")
	const [wordGroup, setWordGroup] = useState("General")
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevent the default form submission behavior

		const vocabData = {
			word: word || " ",
			translation: translation || " ",
			wordGroup: wordGroup || " ",
		}

		const vocabUrl =
			process.env.REACT_APP_RESOURCES_VOCAB_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/vocabularies"

		const token = sessionStorage.getItem("jwt")

		if (!token) {
			setError("Authorization token is missing. Please log in.")
			return
		}

		try {
			const response = await fetch(vocabUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(vocabData),
			})

			if (response.ok) {
				console.log("Form submitted successfully!")
				setWord("")
				setTranslation("")
				setWordGroup("General")
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
				Submit
			</Button>
			{error && <div className={styles.error}>{error}</div>}
		</form>
	)
}

export default VocabForm
