/** @format */

import React, { useState, useEffect } from "react"
import Letter from "../letter/letter"
import ManToHang from "../manToHang/manToHang"
import WinningMemoryPopup from "../../popups/winningMemoryPopup"
import "./hangman.css"
import { useNavigate } from "react-router"

interface Vocabulary {
	_id: string
	word: string
	translation: string[]
	category: string
}

const HangmanGame: React.FC = () => {
	const [selectedWord, setSelectedWord] = useState<string>("")
	const [guessedLetters, setGuessedLetters] = useState<string[]>([])
	const [wrongGuesses, setWrongGuesses] = useState<number>(0)
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

	const handleLetterClick = (letter: string) => {
		if (selectedWord && !guessedLetters.includes(letter)) {
			setGuessedLetters((prev) => [...prev, letter])
			if (!selectedWord.includes(letter)) {
				setWrongGuesses((prev) => prev + 1)
			}
		}
	}

	const isGameWon =
		selectedWord.length > 0 &&
		selectedWord.split("").every((letter) => guessedLetters.includes(letter))
	const isGameOver = wrongGuesses >= 6

	useEffect(() => {
		if (isGameWon || isGameOver) {
			setShowPopup(true)
		}
	}, [isGameWon, isGameOver])

	const handlePlayAgain = () => {
		setSelectedWord("")
		setGuessedLetters([])
		setWrongGuesses(0)
		setShowPopup(false)
		fetchNewWord()
	}

	const handleReturnToGames = () => {
		navigate('/games')
	}

	return (
		<div className="hangmanGame">
			{error ? (
				<div className="error-message">{error}</div>
			) : (
				<>
					<ManToHang wrongGuesses={wrongGuesses} />
					<div className="word">
						{selectedWord.split("").map((letter, index) => (
							<span key={index} className="letter">
								{guessedLetters.includes(letter) ? letter : "_"}
							</span>
						))}
					</div>
					<div className="keyboard">
						{"abcdefghijklmnopqrstuvwxyzåäö".split("").map((letter) => (
							<Letter
								key={letter}
								letter={letter}
								handleClick={() => handleLetterClick(letter)}
								isChosen={guessedLetters.includes(letter)}
								isIncluded={selectedWord.includes(letter)}
							/>
						))}
					</div>
				</>
			)}
			{showPopup && (
				<WinningMemoryPopup
					message={
						isGameWon ? "You won!" : `Game over! The word was ${selectedWord}`
					}
					onPlayAgain={handlePlayAgain}
					onReturnToGames={handleReturnToGames}
				/>
			)}
		</div>
	)
}

export default HangmanGame
