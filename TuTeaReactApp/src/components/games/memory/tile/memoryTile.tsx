/** @format */

import React from "react"
import "./tile.css" // For styling the tile

interface TileProps {
	resource: any
	id: string
	handleClick: (id: string) => void
	isFlipped: boolean
	isMatched: boolean
}

const Tile: React.FC<TileProps> = ({
	resource,
	id,
	handleClick,
	isFlipped,
	isMatched,
}) => {
	return (
		<div
			className={`tile ${isFlipped ? "isFlipped" : ""} ${
				isMatched ? "isMatched" : ""
			}`}
			onClick={() => handleClick(id)}
		>
			{isFlipped || isMatched ? resource.value : ""}
		</div>
	)
}

export default Tile
