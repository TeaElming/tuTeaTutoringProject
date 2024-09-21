/** @format */

// memoryGame.tsx
import React, { useState, useEffect } from "react"
import Tile from "../tile/memoryTile"
import Popup from "../../popups/winningMemoryPopup"
import "./memoryGame.css"
import { useNavigate } from "react-router"

interface Resource {
	_id: string
	value: string
	category: string
}

interface MemoryGameProps {
	size: [number, number]
	resources: Resource[]
}

interface TileData {
	id: string
	resource: Resource
}

const Memory: React.FC<MemoryGameProps> = ({ size, resources }) => {
	const [tiles, setTiles] = useState<TileData[]>([])
	const [flippedTiles, setFlippedTiles] = useState<string[]>([])
	const [matchedTiles, setMatchedTiles] = useState<string[]>([])
	const [showPopup, setShowPopup] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		initializeGame()
	}, [resources])

	useEffect(() => {
		if (matchedTiles.length === tiles.length && tiles.length > 0) {
			setShowPopup(true)
		}
	}, [matchedTiles])

  const resourceUrl =
  process.env.REACT_APP_RESOURCES_URL ||
  "https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/"

	const initializeGame = () => {
		const gameTiles: TileData[] = []
		resources.forEach((resource, index) => {
			const [word, translation] = resource.value.split(", ")
			gameTiles.push({
				id: `${resource._id}-${index}-word`,
				resource: { ...resource, value: word },
			})
			gameTiles.push({
				id: `${resource._id}-${index}-translation}`,
				resource: { ...resource, value: translation },
			})
		})
		gameTiles.sort(() => Math.random() - 0.5)
		setTiles(gameTiles)
		setFlippedTiles([])
		setMatchedTiles([])
		setShowPopup(false)
	}

	const handleTileClick = (id: string) => {
		if (
			flippedTiles.length === 2 ||
			matchedTiles.includes(id) ||
			flippedTiles.includes(id)
		)
			return

		const newFlippedTiles = [...flippedTiles, id]
		setFlippedTiles(newFlippedTiles)

		if (newFlippedTiles.length === 2) {
			const [firstTile, secondTile] = newFlippedTiles
			const firstTileResource = tiles.find(
				(tile) => tile.id === firstTile
			)?.resource
			const secondTileResource = tiles.find(
				(tile) => tile.id === secondTile
			)?.resource

			if (
				firstTileResource &&
				secondTileResource &&
				firstTileResource._id === secondTileResource._id
			) {
				setMatchedTiles([...matchedTiles, firstTile, secondTile])
			}

			setTimeout(() => setFlippedTiles([]), 1000)
		}
	}

	const renderTiles = () => {
		return tiles.map((tile) => (
			<Tile
				key={tile.id}
				id={tile.id}
				resource={tile.resource}

				handleClick={handleTileClick}
				isFlipped={flippedTiles.includes(tile.id)}
				isMatched={matchedTiles.includes(tile.id)}
			/>
		))
	}

	const handlePlayAgain = () => {
		initializeGame()
	}

	const handleReturnToGames = () => {
		navigate('/games')
	}

	return (
		<div className="memory-game">
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${size[0]}, 1fr)`,
					gridTemplateRows: `repeat(${size[1]}, 1fr)`,
				}}
			>
				{renderTiles()}
			</div>
			{showPopup && (
				<Popup
					message="You win!"
					onPlayAgain={handlePlayAgain}
					onReturnToGames={handleReturnToGames}
				/>
			)}
		</div>
	)
}

export default Memory
