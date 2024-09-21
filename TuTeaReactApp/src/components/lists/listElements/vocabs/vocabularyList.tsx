/** @format */

import React, { useState, useEffect } from "react"
import VocabularyElement from "./vocabElement"
import PaginationButtons from "../../../buttons/paginationButton"
import ResourcePopup from "../../popUpResources/genericResourcePopup"
import SearchBar from "../../sortingOptions/searchBar"
import SortingOptions from "../../sortingOptions/sortingOptions"
import styles from "./vocab.module.css"

interface Vocabulary {
	_id: string
	owner: string
	word: string
	translation: string[]
	wordGroup: string
	__v: number
	added: Date
}

const VocabularyList: React.FC = () => {
	const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
	const [error, setError] = useState<string>("")
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedVocabulary, setSelectedVocabulary] =
		useState<Vocabulary | null>(null)
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [sortOption, setSortOption] = useState<string>("new-old") // Sorting state
	const itemsPerPage = 10

	const vocabUrl =
		process.env.REACT_APP_RESOURCES_VOCAB_URL ||
		"https://cscloud8-85.lnu.se/tutea/resource-service/api/v1/vocabularies"

	// Fetch resources from the API
	const fetchResources = async () => {
		try {
			const token = sessionStorage.getItem("jwt") // Get the JWT token from sessionStorage
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const response = await fetch(vocabUrl, {
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
      console.log("Vocab data: ", data)
			setVocabularies(data)
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	// Effect to load vocabularies on component mount
	useEffect(() => {
		fetchResources()
	}, [])

	// Filter and sort vocabularies based on search query and selected sorting option
	const filteredVocabularies = vocabularies
		.filter((vocabulary) => {
			const query = searchQuery.toLowerCase()
			return (
				vocabulary.word.toLowerCase().includes(query) ||
				vocabulary.translation.some((t) => t.toLowerCase().includes(query))
			)
		})
		.sort((a, b) => {
			switch (sortOption) {
				case "new-old":
					return new Date(b.added).getTime() - new Date(a.added).getTime()
				case "old-new":
					return new Date(a.added).getTime() - new Date(b.added).getTime()
				case "a-z":
					return a.word.localeCompare(b.word)
				case "z-a":
					return b.word.localeCompare(a.word)
				case "a-z-native":
					return a.translation[0].localeCompare(b.translation[0])
				case "z-a-native":
					return b.translation[0].localeCompare(a.translation[0])

				default:
					return 0
			}
		})

	const totalPages = Math.ceil(filteredVocabularies.length / itemsPerPage)
	const currentVocabularies = filteredVocabularies.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const handleClick = (vocabulary: Vocabulary) => {
		setSelectedVocabulary(vocabulary)
	}

	const handleClosePopup = () => {
		setSelectedVocabulary(null)
	}

	return (
		<div>
			<h2>Vocabulary List</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<SearchBar
				query={searchQuery}
				onSearch={setSearchQuery}
				placeholder="Search vocabularies..."
			/>
			<SortingOptions sortOption={sortOption} onSortChange={setSortOption} />{" "}
			{/* Use SortingOptions here */}
			<div className={styles.headerRow}>
				<div className={styles.column}>Word</div>
				<div className={styles.column}>Translation</div>
				<div className={styles.column}>Word Type</div>
			</div>
			{selectedVocabulary ? (
				<ResourcePopup
					resource={selectedVocabulary}
					resourceType="Vocabulary"
					onClose={handleClosePopup}
				/>
			) : (
				<>
					<ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
						{currentVocabularies.map((vocabulary) => (
							<VocabularyElement
								key={vocabulary._id}
								vocabulary={vocabulary}
								onClick={() => handleClick(vocabulary)}
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

export default VocabularyList
