/** @format */

import React, { useState, useEffect } from "react"
import Memory from "./memoryGame"

interface BaseResource {
	_id: string
	category: string
	added: Date
	value: string
}

interface Vocabulary extends BaseResource {
	word: string
	translation: string[]
}

interface Sentence extends BaseResource {
	sentence: string
	semanticTranslation: string
	directTranslation: string
}

interface GrammarRule extends BaseResource {
	rule: string
	description: string
	examples: any[]
}

interface Expression extends BaseResource {
	expression: string
	directTranslation: string
	meaning: string
}

type Resource = Vocabulary | Sentence | GrammarRule | Expression

const resourceTypes = [
	{ label: "Vocabulary", value: "vocabularies" },
	{ label: "Sentence", value: "sentences" },
	{ label: "Grammar Rule", value: "grammatical-rules" },
	{ label: "Expression", value: "expressions" },
]

const gridSizes = [
	{ label: "2x2", value: [2, 2] },
	{ label: "4x4", value: [4, 4] },
	{ label: "4x6", value: [4, 6] },
]

const MemoryGame: React.FC = () => {
	const [resources, setResources] = useState<Resource[]>([])
	const [size, setSize] = useState<[number, number]>([4, 4]) // Default size
	const [resourceType, setResourceType] = useState(resourceTypes[0].value)

	useEffect(() => {
		const fetchResources = async () => {
			try {
				const jwtToken = sessionStorage.getItem("jwt")
				if (!jwtToken) {
					console.error("No JWT token found")
					return
				}

				const headers = {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				}

				const response = await fetch(
					`https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/${resourceType}`,
					{ headers }
				)
				const data = await response.json()

				// Log the type of the data received
				console.log("The data received is of the type:", typeof data, data)

				// Flatten the received data if it is an object
				const flatData = Object.values(data).flat()

				let transformedData: Resource[] = []
				const numPairs = (size[0] * size[1]) / 2 // Number of pairs required

				if (resourceType === "vocabularies") {
					transformedData = (flatData as Vocabulary[])
						.slice(0, numPairs)
						.map((item) => ({
							...item,
							value: `${item.word}, ${item.translation.join(", ")}`,
						}))
				} else if (resourceType === "sentences") {
					transformedData = (flatData as Sentence[])
						.slice(0, numPairs)
						.map((item) => ({
							...item,
							value: `${item.sentence}, ${item.semanticTranslation}`,
						}))
				} else if (resourceType === "grammatical-rules") {
					transformedData = (flatData as GrammarRule[])
						.slice(0, numPairs)
						.map((item) => ({
							...item,
							value: `${item.rule}, ${item.description}`,
						}))
				} else if (resourceType === "expressions") {
					transformedData = (flatData as Expression[])
						.slice(0, numPairs)
						.map((item) => ({
							...item,
							value: `${item.expression}, ${item.directTranslation}`,
						}))
				}

				setResources(transformedData)
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}

		fetchResources()
	}, [resourceType, size])

	return (
		<div>
			<h1>Memory Game</h1>
			<div>
				<label htmlFor="resource-type">Select Resource Type: </label>
				<select
					id="resource-type"
					value={resourceType}
					onChange={(e) => setResourceType(e.target.value)}
				>
					{resourceTypes.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
			</div>
			<div>
				<label htmlFor="grid-size">Select Grid Size: </label>
				<select
					id="grid-size"
					value={JSON.stringify(size)}
					onChange={(e) => setSize(JSON.parse(e.target.value))}
				>
					{gridSizes.map((grid) => (
						<option key={grid.label} value={JSON.stringify(grid.value)}>
							{grid.label}
						</option>
					))}
				</select>
			</div>
			{resources.length > 0 ? (
				<Memory
					key={`${resourceType}-${size}`}
					size={size}
					resources={resources}
				/>
			) : (
				<p>Loading resources...</p>
			)}
		</div>
	)
}

export default MemoryGame
