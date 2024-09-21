/** @format */

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./css/randomVocab.module.css"

interface Vocabulary {
	_id: string
	owner: string
	word: string
	translation: string[]
	wordGroup: string
	__v: number
	added: Date
}

const RandomVocab: React.FC = () => {
	const [randomVocabulary, setRandomVocabulary] = useState<Vocabulary | null>(
		null
	)
	const [error, setError] = useState<string>("")

	const navigate = useNavigate()

	const vocabUrl =
		process.env.REACT_APP_RESOURCES_VOCAB_URL ||
		"https://cscloud8-85.lnu.se/tutea/resource-service/api/v1/vocabularies"

	// Fetch resources from the API
	const fetchResources = async () => {
		try {
			const token = sessionStorage.getItem("jwt") // Get the JWT token from sessionStorage
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const response = await fetch(vocabUrl, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Include the bearer token in the Authorization header
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

			const data: Vocabulary[] = await response.json()

			// Select a random vocabulary item from the list
			const randomIndex = Math.floor(Math.random() * data.length)
			setRandomVocabulary(data[randomIndex])
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	// Effect to load vocabulary on component mount
	useEffect(() => {
		fetchResources()
	}, [])

	const handleRedirect = () => {
		navigate("/resources")
	}

	return (
		<div className={styles.randomVocabContainer} onClick={handleRedirect}>
			<h2>Random Word</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			{randomVocabulary ? (
				<p className={styles.vocabDisplay}>
					<strong>{randomVocabulary.word}</strong> -{" "}
					{randomVocabulary.translation.join(", ")} -{" "}
					{randomVocabulary.wordGroup}
				</p>
			) : (
				<p>Loading...</p>
			)}
		</div>
	)
}

export default RandomVocab
