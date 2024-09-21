/** @format */

import React, { useState } from "react"
import Button from "../../buttons/plainButton"
import styles from "./css/expression.module.css" // Importing the CSS module

interface ExpressionFormProps {
	onSuccess: () => void
}

const ExpressionForm: React.FC<ExpressionFormProps> = ({ onSuccess }) => {
	const [expression, setExpression] = useState("")
	const [directTranslation, setDirectTranslation] = useState("")
	const [meaning, setMeaning] = useState("")
	const [nativeEquivalent, setNativeEquivalent] = useState("")
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevent the default form submission behavior

		const expressionData = {
			expression: expression || " ",
			directTranslation: directTranslation || " ",
			meaning: meaning || " ",
			nativeEquivalent: nativeEquivalent || " ",
		}

		const expressionUrl =
			process.env.REACT_APP_RESOURCES_EXPRESSION_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/expressions"

		const token = sessionStorage.getItem("jwt")

		if (!token) {
			setError("Authorization token is missing. Please log in.")
			return
		}

		try {
			const response = await fetch(expressionUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(expressionData),
			})

			if (response.ok) {
				console.log("Form submitted successfully!")
				setExpression("")
				setDirectTranslation("")
				setMeaning("")
				setNativeEquivalent("")
				setError(null)
				onSuccess()
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
		if (name === "expression") {
			setExpression(value)
		} else if (name === "directTranslation") {
			setDirectTranslation(value)
		} else if (name === "meaning") {
			setMeaning(value)
		} else if (name === "nativeEquivalent") {
			setNativeEquivalent(value)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<div className={styles.formGroup}>
				<label htmlFor="expression" className={styles.label}>
					Expression
				</label>
				<textarea
					id="expression"
					name="expression"
					placeholder="Enter expression..."
					value={expression}
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
			<div className={styles.formGroup}>
				<label htmlFor="meaning" className={styles.label}>
					Meaning
				</label>
				<textarea
					id="meaning"
					name="meaning"
					placeholder="Enter meaning..."
					value={meaning}
					onChange={handleInputChange}
					className={styles.textarea}
				/>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor="nativeEquivalent" className={styles.label}>
					Native Equivalent
				</label>
				<textarea
					id="nativeEquivalent"
					name="nativeEquivalent"
					placeholder="Enter native equivalent..."
					value={nativeEquivalent}
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

export default ExpressionForm
