/** @format */

import React, { useState, useEffect } from "react"
import SentenceElement from "./sentenceElement"
import PaginationButtons from "../../../buttons/paginationButton"
import SearchBar from "../../sortingOptions/searchBar" // Import the SearchBar component
import SortingOptions from "../../sortingOptions/sortingOptions"
import styles from "./sentence.module.css"
import ResourcePopup from "../../popUpResources/genericResourcePopup"

interface Sentence {
	_id: string
	owner: string
	sentence: string
	semanticTranslation: string
	directTranslation: string
	__v: number
	added: Date
}

const SentenceList: React.FC = () => {
	const [sentences, setSentences] = useState<Sentence[]>([])
	const [error, setError] = useState<string>("")
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(
		null
	)
	const [searchQuery, setSearchQuery] = useState<string>("") // State for search query
	const [sortOption, setSortOption] = useState<string>("new-old") // Sorting state
	const itemsPerPage = 10

	const sentenceUrl =
		process.env.REACT_APP_RESOURCES_SENTENCE_URL ||
		"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/sentences"

	// Fetch resources from the API
	const fetchResources = async () => {
		try {
			const token = sessionStorage.getItem("jwt") // Get the JWT token from sessionStorage
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const response = await fetch(sentenceUrl, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Include the bearer token in the Authorization header
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
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	// Fetch resources when the component mounts
	useEffect(() => {
		fetchResources()
	}, [])

	// Filter and sort sentences based on search query
	const filteredSentences = sentences
		.filter((sentence) => {
			const query = searchQuery.toLowerCase()
			return (
				sentence.sentence.toLowerCase().includes(query) ||
				sentence.semanticTranslation.toLowerCase().includes(query) ||
				sentence.directTranslation.toLowerCase().includes(query)
			)
		})
		.sort((a, b) => {
			switch (sortOption) {
				case "new-old":
					return new Date(b.added).getTime() - new Date(a.added).getTime()
				case "old-new":
					return new Date(a.added).getTime() - new Date(b.added).getTime()
				case "a-z":
					return a.sentence.localeCompare(b.sentence)
				case "z-a":
					return b.sentence.localeCompare(a.sentence)
				case "a-z-native":
					return a.semanticTranslation[0].localeCompare(
						b.semanticTranslation[0]
					)
				case "z-a-native":
					return b.semanticTranslation[0].localeCompare(
						a.semanticTranslation[0]
					)
				default:
					return 0
			}
		})

	const totalPages = Math.ceil(filteredSentences.length / itemsPerPage)
	const currentSentences = filteredSentences.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const handleClick = (sentence: Sentence) => {
		setSelectedSentence(sentence)
	}

	const handleClosePopup = () => {
		setSelectedSentence(null)
	}

	return (
		<div>
			<h2>Sentences</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<SearchBar
				query={searchQuery}
				onSearch={setSearchQuery}
				placeholder="Search sentences..."
			/>
			<SortingOptions sortOption={sortOption} onSortChange={setSortOption} />{" "}
			{selectedSentence ? (
				<ResourcePopup
					resource={selectedSentence}
					resourceType="Sentence"
					onClose={handleClosePopup}
				/>
			) : (
				<>
					<div className={styles.headerRow}>
						<div className={styles.column}>Sentence</div>
						<div className={styles.column}>Semantic Translation</div>
						<div className={styles.column}>Direct Translation</div>
					</div>
					<ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
						{currentSentences.map((sentence) => (
							<SentenceElement
								key={sentence._id}
								sentence={sentence}
								onClick={() => handleClick(sentence)}
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

export default SentenceList
