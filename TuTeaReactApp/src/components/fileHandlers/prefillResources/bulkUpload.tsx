/** @format */

import React, { useState, useEffect } from "react"
import Button from "../../buttons/plainButton"
import styles from "./bulkUpload.module.css"

// Define the ResourceConfig interface
interface ResourceConfig {
	filePaths: string[] // Array of file paths for this resource
	schema: (item: any) => any // Function to map item to the appropriate schema
	apiUrl: string // Specific API URL for this resource
}

// Configuration for different resources with specific URLs
const resourceConfigs: Record<string, ResourceConfig> = {
	vocab: {
		filePaths: [
			"preFillResources/vocab/adjective-list.json",
			"preFillResources/vocab/adverb-list.json",
			"preFillResources/vocab/conjunction-list.json",
			"preFillResources/vocab/interjection-list.json",
			"preFillResources/vocab/noun-list.json",
			"preFillResources/vocab/preposition-list.json",
			"preFillResources/vocab/pronoun-list.json",
			"preFillResources/vocab/verb-list.json",
		],
		schema: (item: any) => ({
			word: item.word,
			translation: item.translation,
			wordGroup: item.wordGroup,
		}),
		apiUrl:
			process.env.REACT_APP_RESOURCES_VOCAB_URL ||
			"https://cscloud8-85.lnu.se/tutea/resource-service/api/v1/vocabularies",
	},
	expression: {
		filePaths: ["preFillResources/expression-list.json"],
		schema: (item: any) => ({
			expression: item.expression,
			directTranslation: item.directTranslation,
			nativeEquivalent: item.nativeEquivalent,
		}),
		apiUrl:
			process.env.REACT_APP_RESOURCES_EXPRESSION_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/expressions",
	},
	grammar: {
		filePaths: ["preFillResources/grammar-list.json"],
		schema: (item: any) => ({
			rule: item.rule,
			description: item.description,
			comment: item.comment,
		}),
		apiUrl:
			process.env.REACT_APP_RESOURCES_GRAMMAR_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/grammatical-rules",
	},
	sentence: {
		filePaths: ["preFillResources/sentence-list.json"],
		schema: (item: any) => ({
			sentence: item.sentence,
			semanticTranslation: item.semanticTranslation,
			directTranslation: item.directTranslation,
		}),
		apiUrl:
			process.env.REACT_APP_RESOURCES_SENTENCE_URL ||
			"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/sentences",
	},
}

const BulkUpload: React.FC = () => {
	const initialChecked = Object.keys(resourceConfigs).reduce((acc, key) => {
		acc[key] = true
		return acc
	}, {} as Record<string, boolean>)

	const [checkedResources, setCheckedResources] =
		useState<Record<string, boolean>>(initialChecked)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [completedResources, setCompletedResources] = useState<
		Record<string, boolean>
	>({})

	const handleCheckboxChange = (resourceType: string) => {
		setCheckedResources((prev) => ({
			...prev,
			[resourceType]: !prev[resourceType],
		}))
	}

	const handleBulkUpload = async () => {
		setError(null)
		setSuccessMessage(null)

		if (!checkedResources) {
			return
		}

		try {
			const jwtToken = sessionStorage.getItem("jwt")
			if (!jwtToken) {
				setError("No JWT token found")
				return
			}

			for (const resourceType of Object.keys(checkedResources)) {
				if (!checkedResources[resourceType]) continue

				const config: ResourceConfig = resourceConfigs[resourceType]
				for (const filePath of config.filePaths) {
					const fileResponse = await fetch(filePath)
					const dataList = await fileResponse.json()

					for (const item of dataList) {
						const resourceData = config.schema(item)

						try {
							const response = await fetch(config.apiUrl, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${jwtToken}`,
								},
								body: JSON.stringify(resourceData),
							})

							if (!response.ok) {
								const errorMessage = await response.text()
								console.error(
									`Failed to upload ${resourceType} item: ${errorMessage}`
								)
								continue
							}
						} catch (err) {
							console.error(`Error uploading ${resourceType} item:`, err)
							continue
						}
					}
				}
				setCompletedResources((prev) => ({ ...prev, [resourceType]: true }))
			}

			setSuccessMessage(
				"All selected resources uploaded successfully, skipping any faulty items."
			)
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(`Error uploading resources: ${error.message}`)
			} else {
				setError("An unknown error occurred.")
			}
		}
	}

	return (
		<div className={styles.bulkUploadContainer}>
			<p>
				Upload a list of pre-selected resources to help you start your learning
				journey.
			</p>
			<div className={styles.checkboxContainer}>
				{Object.keys(resourceConfigs).map(
					(resourceType) =>
						!completedResources[resourceType] && (
							<div key={resourceType} className={styles.checkboxItem}>
								<input
									type="checkbox"
									checked={checkedResources[resourceType]}
									onChange={() => handleCheckboxChange(resourceType)}
								/>
								<label>{resourceType}</label>
							</div>
						)
				)}
			</div>
			<Button onClick={handleBulkUpload} className={styles.button}>
				Upload Selected Resources
			</Button>
			{error && <div className={styles.error}>{error}</div>}
			{successMessage && <div className={styles.success}>{successMessage}</div>}
		</div>
	)
}


export default BulkUpload
