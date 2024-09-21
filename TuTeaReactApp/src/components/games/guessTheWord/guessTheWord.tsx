/** @format */

import React, { useState, useEffect } from "react"
import WinningMemoryPopup from "../popups/winningMemoryPopup"
import "./guessTheWord.css"
import { useNavigate } from "react-router"

interface Vocabulary {
	_id: string
	word: string
	translation: string[]
	category: string
}

const GuessTheWord: React.FC = () => {
	const [selectedWord, setSelectedWord] = useState<string>("")
	const [translation, setTranslation] = useState<string>("")
	const [userInput, setUserInput] = useState<string>("")
	const [showPopup, setShowPopup] = useState(false)
	const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

	useEffect(() => {
		fetchNewWord()
	}, [])

	const vocabUrl =
		process.env.REACT_APP_RESOURCES_VOCAB_URL ||
		"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/vocabularies"

	const sanitizeWord = (word: string): string => {
		// If the word contains a space, return an empty string to signal invalid word
		if (word.includes(" ")) {
			return ""
		}

		// Handle words with '/' by splitting and picking one part randomly
		if (word.includes("/")) {
			const options = word.split("/")
			word = options[Math.floor(Math.random() * options.length)]
		}

		// Return the word as is, allowing for hyphens, apostrophes, etc.
		return word.toLowerCase()
	}

	const fetchNewWord = async () => {
		try {
			const jwtToken = sessionStorage.getItem("jwt")
			if (!jwtToken) {
				console.error("No JWT token found")
				setError("Authentication error. Please log in again.")
				return
			}

			const headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			}

			let sanitizedWord = ""
			let attempts = 0

			// Keep fetching a word until a valid one is found or limit the number of attempts
			while (!sanitizedWord && attempts < 10) {
				const response = await fetch(vocabUrl, { headers })
				const data: Vocabulary[] = await response.json()

				if (data.length > 0) {
					const randomIndex = Math.floor(Math.random() * data.length)
					sanitizedWord = sanitizeWord(data[randomIndex].word)
					if (sanitizedWord) {
						setTranslation(data[randomIndex].translation[0])
					}
				}

				attempts++
			}

			if (sanitizedWord) {
				setSelectedWord(sanitizedWord)
				setError(null) // Clear any previous error
			} else {
				setError("Could not find a valid word after multiple attempts.")
			}
		} catch (error) {
			console.error("Error fetching data:", error)
			setError("An error occurred while fetching data. Please try again.")
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value.toLowerCase()
		setUserInput(input)
		if (input === selectedWord) {
			setShowPopup(true)
		}
	}

	const handlePlayAgain = () => {
		setUserInput("")
		setShowPopup(false)
		fetchNewWord()
	}

	const handleReturnToGames = () => {
		navigate('/games')
	}

	const getLetterClass = (letter: string, index: number) => {
		if (userInput[index] === letter) {
			return "correct"
		} else if (selectedWord.includes(userInput[index])) {
			return "misplaced"
		} else if (userInput[index]) {
			return "incorrect"
		}
		return ""
	}

	return (
		<div className="guessTheWordGame">
			{error ? (
				<div className="error-message">{error}</div>
			) : (
				<>
					<h2>How do you say: {translation}?</h2>
					<input
						type="text"
						value={userInput}
						onChange={handleChange}
						className="inputBox"
					/>
					<div className="wordBox">
						{selectedWord.split("").map((letter, index) => (
							<span
								key={index}
								className={`letter ${getLetterClass(letter, index)}`}
							>
								{userInput[index] || "_"}
							</span>
						))}
					</div>
				</>
			)}
			{showPopup && (
				<WinningMemoryPopup
					message="You won!"
					onPlayAgain={handlePlayAgain}
					onReturnToGames={handleReturnToGames}
				/>
			)}
		</div>
	)
}

export default GuessTheWord
