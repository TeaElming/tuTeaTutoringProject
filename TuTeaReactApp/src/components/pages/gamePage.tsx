/** @format */

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./css/gamePage.css"

const GamePage: React.FC = () => {
	const [username, setUsername] = useState("")

	useEffect(() => {
		const fetchUser = async () => {
			const userId = sessionStorage.getItem("currentUserId")
			const jwtToken = sessionStorage.getItem("jwt")
			if (userId && jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_USERS}/${userId}`,
						{
							headers: {
								Authorization: `Bearer ${jwtToken}`, // Include JWT token in the request headers
							},
						}
					)
					if (response.ok) {
						const user = await response.json()
						setUsername(user.name) // Assuming the user object has a 'name' field
					} else {
						console.error("Error fetching user:", response.statusText)
					}
				} catch (error) {
					console.error("Error fetching user:", error)
				}
			}
		}

		fetchUser()
	}, [])

	return (
		<div className="gamePageContainer">
			<div className="gamesContainer">
				<div className="gameCard">
					<Link to="memory">
						<img src="imgs/memoryGame.jpg" alt="Memory Game" />
						<div className="gameTitle">Memory Game</div>
					</Link>
				</div>
				<div className="gameCard">
					<Link to="hangman">
						<img src="imgs/hangman.jpg" alt="Hangman Game" />
						<div className="gameTitle">Hangman Game</div>
					</Link>
				</div>
				<div className="gameCard">
					<Link to="guess-the-word">
						<img src="imgs/guessTheWord.jpg" alt="Guess the Word Game" />
						<div className="gameTitle">Guess the Word Game</div>
					</Link>
				</div>
				<div className="gameCard">
					<Link to="sentence-scrambler">
						<img src="imgs/sentenceScrambler.jpg" alt="Sentence Scrambler Game" />
						<div className="gameTitle">Sentence Scrambler Game</div>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default GamePage
