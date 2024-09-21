/** @format */

import React, { useState, useEffect } from "react"
import WinningSentencePopup from "../popups/sentencePopup"
import styles from "./sentenceScramblerGame.module.css"
import { useNavigate } from "react-router"

interface Sentence {
	_id: string
	owner: string
	sentence: string
	semanticTranslation: string
	directTranslation: string
	__v: number
	added: Date
}

const SentenceScramblerGame: React.FC = () => {
	const [sentences, setSentences] = useState<Sentence[]>([])
	const [error, setError] = useState<string>("")
	const [currentSentence, setCurrentSentence] = useState<string[]>([])
	const [dropZoneWords, setDropZoneWords] = useState<string[]>([])
	const [originalSentence, setOriginalSentence] = useState<string>("")
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [showPopup, setShowPopup] = useState<boolean>(false)

  const navigate = useNavigate()

	const sentenceUrl =
		process.env.REACT_APP_RESOURCES_SENTENCES_URL ||
		"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/sentences"

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

			const data = await response.json()
			setSentences(data)
			selectRandomSentence(data)
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	const selectRandomSentence = (sentences: Sentence[]) => {
		const randomIndex = Math.floor(Math.random() * sentences.length)
		const sentence = sentences[randomIndex].sentence
		setOriginalSentence(sentence)
		setCurrentSentence(shuffleArray(sentence.split(" ")))
		setDropZoneWords(Array(sentence.split(" ").length).fill(""))
		setIsCorrect(null)
		setShowPopup(false)
	}

	const shuffleArray = (array: string[]) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	const handleDragStart = (
		event: React.DragEvent<HTMLDivElement>,
		index: number
	) => {
		event.dataTransfer.setData("text/plain", index.toString())
	}

	const handleDrop = (
		event: React.DragEvent<HTMLDivElement>,
		index: number
	) => {
		event.preventDefault()
		const draggedFromIndex = parseInt(event.dataTransfer.getData("text/plain"))

		// Prevent placing multiple words in the same box
		if (dropZoneWords[index]) {
			return
		}

		const draggedWord = currentSentence[draggedFromIndex]
		const newDropZoneWords = [...dropZoneWords]
		newDropZoneWords[index] = draggedWord

		const newCurrentSentence = [...currentSentence]
		newCurrentSentence[draggedFromIndex] = ""

		setDropZoneWords(newDropZoneWords)
		setCurrentSentence(newCurrentSentence)
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
	}

	const handleRemoveWord = (index: number) => {
		const wordToReturn = dropZoneWords[index]
		const newDropZoneWords = [...dropZoneWords]
		newDropZoneWords[index] = ""

		const newCurrentSentence = [...currentSentence]
		const emptyIndex = newCurrentSentence.findIndex((word) => word === "")
		if (emptyIndex !== -1) {
			newCurrentSentence[emptyIndex] = wordToReturn
		}

		setDropZoneWords(newDropZoneWords)
		setCurrentSentence(newCurrentSentence)
	}

	const handleClearAll = () => {
		const newCurrentSentence = originalSentence.split(" ")
		setDropZoneWords(Array(newCurrentSentence.length).fill(""))
		setCurrentSentence(shuffleArray(newCurrentSentence))
	}

	const handleCheck = () => {
		const isCorrect = dropZoneWords.join(" ") === originalSentence
		setIsCorrect(isCorrect)
		setShowPopup(true)
	}

	useEffect(() => {
		fetchResources()
	}, [])

	const handleTryAgain = () => {
		// Resets only the drop zone and current sentence arrays to allow retry
		setDropZoneWords(Array(originalSentence.split(" ").length).fill(""))
		setCurrentSentence(shuffleArray(originalSentence.split(" ")))
		setIsCorrect(null)
		setShowPopup(false)
	}

	const handlePlayAgain = () => {
		selectRandomSentence(sentences)
	}

	const handleReturnToGames = () => {
		navigate('/games')
	}

	return (
		<div>
			<h2>Sentence Scrambler Game</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<div className={styles.sentenceContainer}>
				{currentSentence.map(
					(word, index) =>
						word && (
							<div
								key={index}
								draggable
								onDragStart={(event) => handleDragStart(event, index)}
								className={styles.wordButton}
							>
								{word}
							</div>
						)
				)}
			</div>
			<div className={styles.dropZoneContainer}>
				{dropZoneWords.map((word, index) => (
					<div
						key={index}
						onDrop={(event) => handleDrop(event, index)}
						onDragOver={handleDragOver}
						className={styles.dropZone}
					>
						{word && (
							<div className={styles.wordInDropZone}>
								{word}
								<button
									className={styles.removeButton}
									onClick={() => handleRemoveWord(index)}
								>
									&times;
								</button>
							</div>
						)}
					</div>
				))}
			</div>
			<div className={styles.actions}>
				<button onClick={handleCheck}>Check Sentence</button>
				<button onClick={() => selectRandomSentence(sentences)}>
					New Sentence
				</button>
				<button onClick={handleClearAll}>Clear All</button>
			</div>
			{showPopup && (
				<WinningSentencePopup
					isCorrect={isCorrect as boolean}
					originalSentence={originalSentence}
					onNewSentence={handlePlayAgain}
					onReturnToGames={handleReturnToGames}
					onTryAgain={handleTryAgain}
				/>
			)}
		</div>
	)
}

export default SentenceScramblerGame
