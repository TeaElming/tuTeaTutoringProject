/** @format */

import React, { useState } from "react"
import Button from "../../buttons/plainButton" // Assuming this is the updated Button
import styles from "./css/grammar.module.css" // Importing the CSS module

interface GrammaticalRuleFormProps {
	onSuccess: () => void // Prop to handle success action
}

const GrammaticalRuleForm: React.FC<GrammaticalRuleFormProps> = ({
	onSuccess,
}) => {
	const [rule, setRule] = useState("")
	const [description, setDescription] = useState("")
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevent the default form submission behavior

		const ruleData = {
			rule: rule || " ",
			description: description || " ",
		}

		const grammarUrl =
			process.env.REACT_APP_RESOURCES_GRAMMAR_URL ||
			"https://cscloud8-85.lnu.se/tuTea/user-service/api/v1/grammatical-rules"

		const token = sessionStorage.getItem("jwt")

		if (!token) {
			setError("Authorization token is missing. Please log in.")
			return
		}

		try {
			const response = await fetch(grammarUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(ruleData),
			})

			if (response.ok) {
				console.log("Form submitted successfully!")
				setRule("")
				setDescription("")
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
		if (name === "rule") {
			setRule(value)
		} else if (name === "description") {
			setDescription(value)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<div className={styles.formGroup}>
				<label htmlFor="rule" className={styles.label}>
					Grammatical Rule
				</label>
				<input
					id="rule"
					type="text"
					name="rule"
					placeholder="Enter grammatical rule..."
					value={rule}
					onChange={handleInputChange}
					className={styles.input}
				/>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor="description" className={styles.label}>
					Description
				</label>
				<input
					id="description"
					type="text"
					name="description"
					placeholder="Enter description..."
					value={description}
					onChange={handleInputChange}
					className={styles.input}
				/>
			</div>
			<div className={styles.buttonContainer}>
				<Button type="submit" className={styles.button}>
					Submit
				</Button>
			</div>
			{error && <div className={styles.error}>{error}</div>}
		</form>
	)
}

export default GrammaticalRuleForm
