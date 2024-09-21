/** @format */

import React, { useState, useEffect } from "react"
import GrammarElement from "./grammarElement"
import PaginationButtons from "../../../buttons/paginationButton"
import SearchBar from "../../sortingOptions/searchBar"
import SortingOptions from "../../sortingOptions/sortingOptions"
import styles from "./grammar.module.css"
import ResourcePopup from "../../popUpResources/genericResourcePopup"

interface GrammarRule {
	_id: string
	rule: string
	description: string
	__v: number
	added: Date
}

const GrammarList: React.FC = () => {
	const [grammaticalRules, setGrammaticalRules] = useState<GrammarRule[]>([])
	const [error, setError] = useState<string>("")
	const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("") // State for search query
	const [sortOption, setSortOption] = useState<string>("new-old") // Sorting state

	const itemsPerPage = 10

	const grammarUrl =
		process.env.REACT_APP_RESOURCES_GRAMMAR_URL ||
		"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/grammatical-rules"

	// Fetch resources from the API
	const fetchResources = async () => {
		try {
			const token = sessionStorage.getItem("jwt") // Get the JWT token from sessionStorage
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const response = await fetch(grammarUrl, {
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
			setGrammaticalRules(data)
		} catch (error: any) {
			setError("An error occurred. Please try again.")
		}
	}

	// Effect to load grammatical rules on component mount
	useEffect(() => {
		fetchResources()
	}, [])

	// Filter and sort grammatical rules based on search query
	const filteredRules = grammaticalRules
		.filter((rule) => {
			const query = searchQuery.toLowerCase()
			return (
				rule.rule.toLowerCase().includes(query) ||
				rule.description.toLowerCase().includes(query)
			)
		})
		.sort((a, b) => {
			switch (sortOption) {
				case "new-old":
					return new Date(b.added).getTime() - new Date(a.added).getTime()
				case "old-new":
					return new Date(a.added).getTime() - new Date(b.added).getTime()
				case "a-z":
					return a.rule.localeCompare(b.rule)
				case "z-a":
					return b.rule.localeCompare(a.rule)
				case "a-z-native":
					return a.description[0].localeCompare(b.description[0])
				case "z-a-native":
					return b.description[0].localeCompare(a.description[0])
				default:
					return 0
			}
		})
	const totalPages = Math.ceil(filteredRules.length / itemsPerPage)
	const currentGrammaticalRules = filteredRules.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const handleClick = (grammarRule: GrammarRule) => {
		setSelectedRule(grammarRule
    )
	}

	const handleClosePopup = () => {
		setSelectedRule(null)
	}

  return (
    <div>
        <h2>Grammatical Rule List</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <SearchBar
            query={searchQuery}
            onSearch={setSearchQuery}
            placeholder="Search grammatical rules..."
        />
        <SortingOptions sortOption={sortOption} onSortChange={setSortOption} />

        {selectedRule ? (
            <ResourcePopup
                resource={selectedRule}
                resourceType="GrammarRule"
                onClose={handleClosePopup}
            />
        ) : (
            <>
                <div className={styles.headerRow}>
                    <div className={styles.column}>Rule</div>
                    <div className={styles.column}>Description</div>
                </div>
                <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
                    {currentGrammaticalRules.map((rule) => (
                        <GrammarElement
                            key={rule._id}
                            grammarRule={rule}
                            onClick={() => handleClick(rule)}
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
);

}

export default GrammarList
