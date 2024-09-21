/** @format */

// Popup.tsx
import React from "react"
import "./memoryPopup.css" // Create this CSS file for basic styling

interface MemoryPopupProps {
	message: string
	onPlayAgain: () => void
	onReturnToGames: () => void
}

const WinningMemoryPopup: React.FC<MemoryPopupProps> = ({
	message,
	onPlayAgain,
	onReturnToGames,
}) => {
	return (
		<div className="popup-overlay">
			<div className="popup">
				<h3>{message}</h3>
				<button onClick={onPlayAgain}>Play Again</button>
				<button onClick={onReturnToGames}>Return to Games</button>
			</div>
		</div>
	)
}

export default WinningMemoryPopup
