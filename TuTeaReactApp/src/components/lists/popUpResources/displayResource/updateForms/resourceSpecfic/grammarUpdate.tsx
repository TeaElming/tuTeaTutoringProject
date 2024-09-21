/** @format */

import React, { useState, useEffect } from "react"
import Button from "../../../../../buttons/plainButton"
import styles from "../../../../../forms/resources/css/grammar.module.css" // Importing the CSS module

interface GrammarRule {
	_id: string
	rule: string
	description: string
	owner: string
	__v: number
	added: Date
}

interface GrammarRuleUpdateProps {
	grammarRuleResource: GrammarRule // Prop to receive the existing rule data
	handleOnClose: () => void
}

const GrammaticalRuleUpdateForm: React.FC<GrammarRuleUpdateProps> = ({
	grammarRuleResource,
	handleOnClose,
}) => {
	const [rule, setRule] = useState(grammarRuleResource.rule || "")
	const [description, setDescription] = useState(
		grammarRuleResource.description || ""
	)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	useEffect(() => {
		// Prefill form data when the component mounts or when the resource changes
		setRule(grammarRuleResource.rule)
		setDescription(grammarRuleResource.description)
	}, [grammarRuleResource])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const ruleData = {
			rule: rule || " ",
			description: description || " ",
		}

		const grammarUrl =
			process.env.REACT_APP_RESOURCES_GRAMMAR_URL ||
			"https://cscloud8-85.lnu.se/tuTea/user-service/api/v1/grammatical-rules"

		const updateUrl = `${grammarUrl}/${grammarRuleResource._id}`

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
				body: JSON.stringify(ruleData),
			})

			if (response.ok) {
				setSuccessMessage("Grammatical rule updated successfully!")
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
				setError(`Error updating grammatical rule: ${error.message}`)
			} else {
				setError("An unknown error occurred.")
			}
			setSuccessMessage(null)
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
					Update
				</Button>
				<Button type="button" onClick={handleOnClose} className={styles.button}>
					Cancel
				</Button>
			</div>
			{error && <div className={styles.error}>{error}</div>}
			{successMessage && <div className={styles.success}>{successMessage}</div>}
		</form>
	)
}

export default GrammaticalRuleUpdateForm
