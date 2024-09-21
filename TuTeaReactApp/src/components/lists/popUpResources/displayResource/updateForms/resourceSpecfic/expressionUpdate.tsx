/** @format */

import React, { useState, useEffect } from "react"
import Button from "../../../../../buttons/plainButton"
import styles from "../../../../../forms/resources/css/expression.module.css"

interface Expression {
	_id: string
	expression: string
	directTranslation: string
	meaning: string
	nativeEquivalent: string
	owner: string
	__v: number
	added: Date
}

interface ExpressionUpdateProps {
	expressionResource: Expression // Correct the prop name to match usage
	handleOnClose: () => void
}

const ExpressionUpdateForm: React.FC<ExpressionUpdateProps> = ({
	expressionResource,
	handleOnClose,
}) => {
	const [expression, setExpression] = useState(
		expressionResource.expression || ""
	)
	const [directTranslation, setDirectTranslation] = useState(
		expressionResource.directTranslation || ""
	)
	const [meaning, setMeaning] = useState(expressionResource.meaning || "")
	const [nativeEquivalent, setNativeEquivalent] = useState(
		expressionResource.nativeEquivalent || ""
	)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	useEffect(() => {
		// Prefill form data when the component mounts or when the resource changes
		setExpression(expressionResource.expression)
		setDirectTranslation(expressionResource.directTranslation)
		setMeaning(expressionResource.meaning)
		setNativeEquivalent(expressionResource.nativeEquivalent)
	}, [expressionResource])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const expressionData = {
			expression: expression || " ",
			directTranslation: directTranslation || " ",
			meaning: meaning || " ",
			nativeEquivalent: nativeEquivalent || " ",
		}

		const expressionUrl =
			process.env.REACT_APP_RESOURCES_EXPRESSION_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/expressions"

		const updateUrl = `${expressionUrl}/${expressionResource._id}`

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
				body: JSON.stringify(expressionData),
			})

			if (response.ok) {
				setSuccessMessage("Expression updated successfully!")
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
				setError(`Error updating expression: ${error.message}`)
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

export default ExpressionUpdateForm
