/** @format */

// UpdatedPopup.tsx
import React, { useState } from "react"
import "./memoryPopup.css" // Ensure this file includes styles for the popup

interface SentencePopupProps {
	isCorrect: boolean
	originalSentence: string
	onNewSentence: () => void
	onReturnToGames: () => void
	onTryAgain: () => void
}

const WinningSentencePopup: React.FC<SentencePopupProps> = ({
	isCorrect,
	originalSentence,
	onNewSentence,
	onReturnToGames,
	onTryAgain,
}) => {
	const [showCorrectSentence, setShowCorrectSentence] = useState(false)

	const handleNo = () => {
		setShowCorrectSentence(true)
	}

	return (
		<div className="popup-overlay">
			<div className="popup">
				{isCorrect ? (
					<>
						<h3>You won!</h3>
						<button onClick={onNewSentence}>New Sentence</button>
						<button onClick={onReturnToGames}>Return to Games</button>
					</>
				) : showCorrectSentence ? (
					<>
						<h3>The correct sentence was "{originalSentence}"</h3>
						<button onClick={onNewSentence}>New Sentence</button>
						<button onClick={onReturnToGames}>Return to Games</button>
					</>
				) : (
					<>
						<h3>That is not correct. Would you like to try again?</h3>
						<button onClick={onTryAgain}>Yes</button>
						<button onClick={handleNo}>No</button>
					</>
				)}
			</div>
		</div>
	)
}

export default WinningSentencePopup
