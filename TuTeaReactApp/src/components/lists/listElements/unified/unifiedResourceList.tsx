/** @format */

import React, { useState, useEffect } from "react"
import UnifiedResourceElement from "./unifiedResourceElement"
import PaginationButtons from "../../../buttons/paginationButton"
import SearchBar from "../../sortingOptions/searchBar"
import styles from "./unifiedResources.module.css"
import ResourcePopup from "../../popUpResources/genericResourcePopup"

interface Vocabulary {
	_id: string
	owner: string
	word: string
	translation: string[]
	wordGroup: string
	__v: number
	added: Date
	category: string
}

interface Sentence {
	_id: string
	owner: string
	sentence: string
	semanticTranslation: string
	directTranslation: string
	__v: number
	added: Date
	category: string
}

interface GrammarRule {
	_id: string
	owner: string
	rule: string
	description: string
	comment: string
	examples: any[]
	__v: number
	added: Date
	category: string
}

interface Expression {
	_id: string
	owner: string
	expression: string
	directTranslation: string
	meaning: string
	nativeEquivalent: string
	__v: number
	added: Date
	category: string
}

type Resource = Vocabulary | Sentence | GrammarRule | Expression

const UnifiedResourceList: React.FC = () => {
	const [resources, setResources] = useState<Resource[]>([])
	const [error, setError] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedResource, setSelectedResource] = useState<Resource | null>(
		null
	)
	const [searchQuery, setSearchQuery] = useState<string>("") // State for search query

	const itemsPerPage = 10

	// Fetch resources from the API
	const fetchResources = async () => {
		try {
			const token = sessionStorage.getItem("jwt") // Get the JWT token from sessionStorage
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const unifiedResourcesUrl =
				process.env.REACT_APP_UNIFIED_RESOURCES_URL ||
				"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/unified-resources/"

			const response = await fetch(
				`${unifiedResourcesUrl}/sorted?criteria=date&order=desc`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Include the bearer token in the Authorization header
					},
				}
			)

			if (!response.ok) {
				const errorMessage = await response.text()
				setError(`Error fetching resources: ${errorMessage}`)
				return
			}

			const contentType = response.headers.get("content-type")
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error("Received non-JSON response from the server.")
			}

			const data: { [key: string]: Resource[] } = await response.json()
			const allResources = Object.entries(data).flatMap(([category, items]) =>
				items.map((item: Resource) => ({ ...item, category }))
			)

			// Sort resources by date
			const sortedResources = allResources.sort(
				(a, b) => new Date(b.added).getTime() - new Date(a.added).getTime()
			)

			setResources(sortedResources)
		} catch (error: any) {
			setError(`Error fetching resources: ${error.message}`)
		}
	}

	// Effect to load resources on component mount
	useEffect(() => {
		fetchResources()
	}, [])

	// Filter and sort resources based on search query
	const filteredResources = resources
		.filter((resource) => {
			const query = searchQuery.toLowerCase()
			return (
				// Add search conditions for different resource fields
				("word" in resource && resource.word.toLowerCase().includes(query)) ||
				("translation" in resource &&
					resource.translation.some((t) => t.toLowerCase().includes(query))) ||
				("sentence" in resource &&
					resource.sentence.toLowerCase().includes(query)) ||
				("semanticTranslation" in resource &&
					resource.semanticTranslation.toLowerCase().includes(query)) ||
				("directTranslation" in resource &&
					resource.directTranslation.toLowerCase().includes(query)) ||
				("rule" in resource && resource.rule.toLowerCase().includes(query)) ||
				("expression" in resource &&
					resource.expression.toLowerCase().includes(query)) ||
				("meaning" in resource &&
					resource.meaning.toLowerCase().includes(query))
			)
		})
		.sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime()) // Sort by newest to oldest

	const totalPages = Math.ceil(filteredResources.length / itemsPerPage)
	const currentResources = filteredResources.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const handleClick = (resource: Resource) => {
		setSelectedResource(resource)
	}

	const handleClosePopup = () => {
		setSelectedResource(null)
	}

	return (
		<div>
			<h2>All resources</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<SearchBar
				query={searchQuery}
				onSearch={setSearchQuery}
				placeholder="Search unified resources..."
			/>
			{selectedResource ? (
				<ResourcePopup
					resource={selectedResource}
					resourceType={selectedResource.category}
					onClose={handleClosePopup}
				/>
			) : (
				<>
					<ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
						{currentResources.map((resource) => (
							<UnifiedResourceElement
								key={resource._id}
								resource={resource}
								onClick={() => handleClick(resource)} 
							/>
						))}
					</ul>
					<PaginationButtons
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</div>
	)
}

export default UnifiedResourceList
