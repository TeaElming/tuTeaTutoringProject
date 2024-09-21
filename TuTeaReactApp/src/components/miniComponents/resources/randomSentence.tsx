/** @format */

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./css/randomSentence.module.css"

interface Sentence {
	_id: string
	owner: string
	sentence: string
	semanticTranslation: string
	directTranslation: string
	__v: number
	added: Date
}

const RandomSentence: React.FC = () => {
	const [randomSentence, setRandomSentence] = useState<Sentence | null>(null)
	const [error, setError] = useState<string>("")

	const navigate = useNavigate()

	const sentenceUrl =
		process.env.REACT_APP_RESOURCES_SENTENCE_URL ||
		"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/sentences"

	// Fetch resources from the API
	const fetchResources = async () => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const response = await fetch(sentenceUrl, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const errorMessage = await response.text()
				setError(errorMessage)
				return
			}

			const contentType = response.headers.get("content-type")
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error("Received non-JSON response from the server.")
			}

			const data: Sentence[] = await response.json()

			// Select a random sentence from the list
			const randomIndex = Math.floor(Math.random() * data.length)
			setRandomSentence(data[randomIndex])
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	// Effect to load sentence on component mount
	useEffect(() => {
		fetchResources()
	}, [])

	const handleRedirect = () => {
		navigate("/resources")
	}

	return (
		<div className={styles.randomSentenceContainer} onClick={handleRedirect}>
			<h2>Random Sentence</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			{randomSentence ? (
				<div className={styles.sentenceDisplay}>
					<p>
						<strong>{randomSentence.sentence}</strong>
					</p>
					<p> {randomSentence.semanticTranslation}</p>
					<p>{randomSentence.directTranslation}</p>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	)
}

export default RandomSentence
