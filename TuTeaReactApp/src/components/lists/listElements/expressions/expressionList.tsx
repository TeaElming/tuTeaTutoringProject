/** @format */

import React, { useState, useEffect } from "react"
import ExpressionElement from "./expressionElement"
import PaginationButtons from "../../../buttons/paginationButton"
import SearchBar from "../../sortingOptions/searchBar"
import SortingOptions from "../../sortingOptions/sortingOptions"
import styles from "./expression.module.css"
import ResourcePopup from "../../popUpResources/genericResourcePopup"

interface Expression {
	_id: string
	expression: string
	directTranslation: string
	meaning: string
	nativeEquivalent: string
	__v: number
	added: Date
}

const ExpressionList: React.FC = () => {
	const [expressions, setExpressions] = useState<Expression[]>([])
	const [error, setError] = useState<string>("")
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedExpression, setSelectedExpression] =
		useState<Expression | null>(null)
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [sortOption, setSortOption] = useState<string>("new-old")

	const itemsPerPage = 10

	const expressionUrl =
		process.env.REACT_APP_RESOURCES_EXPRESSION_URL ||
		"https://cscloud8-85.lnu.se/tuTea/resource-service/api/v1/expressions"

	// Fetch resources from the API
	const fetchResources = async () => {
		try {
			const token = sessionStorage.getItem("jwt")
			if (!token) {
				setError("No authorization token found.")
				return
			}

			const response = await fetch(expressionUrl, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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
			if (data) {
				// Assuming each key in the object corresponds to a set of expressions by a specific owner
				const allExpressions = Object.values(data).flat() as Expression[]
				setExpressions(allExpressions)

				setExpressions(allExpressions)
			} else {
				setError("No data returned from server.")
			}
		} catch (error: any) {
			console.error("Fetch error:", error)
			setError("An error occurred. Please try again.")
		}
	}

	// Effect to load expressions on component mount
	useEffect(() => {
		fetchResources()
	}, [])

	// Filter and sort expressions based on search query
	const filteredExpressions = expressions
		.filter((expression) => {
			const query = searchQuery.toLowerCase()
			return (
				expression.expression.toLowerCase().includes(query) ||
				expression.directTranslation.toLowerCase().includes(query) ||
				expression.nativeEquivalent.toLowerCase().includes(query)
			)
		})
		.sort((a, b) => {
			switch (sortOption) {
				case "new-old":
					return new Date(b.added).getTime() - new Date(a.added).getTime()
				case "old-new":
					return new Date(a.added).getTime() - new Date(b.added).getTime()
				case "a-z":
					return a.expression.localeCompare(b.expression)
				case "z-a":
					return b.expression.localeCompare(a.expression)
				case "a-z-native":
					return a.nativeEquivalent.localeCompare(b.nativeEquivalent)
				case "z-a-native":
					return b.nativeEquivalent.localeCompare(a.nativeEquivalent)
				default:
					return 0
			}
		})

	const totalPages = Math.ceil(filteredExpressions.length / itemsPerPage)
	const currentExpressions = filteredExpressions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const handleClick = (expression: Expression) => {
		setSelectedExpression(expression)
	}

	const handleClosePopup = () => {
		setSelectedExpression(null)
	}

	return (
		<div>
			<h2>Expression List</h2>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<SearchBar
				query={searchQuery}
				onSearch={setSearchQuery}
				placeholder="Search expressions..."
			/>
			<SortingOptions sortOption={sortOption} onSortChange={setSortOption} />
			<div className={styles.headerRow}>
				<div className={styles.column}>Expression</div>
				<div className={styles.column}>Direct Translation</div>
				<div className={styles.column}>Meaning</div>
				<div className={styles.column}>Native Equivalent</div>
			</div>
			{selectedExpression ? (
				<ResourcePopup
					resource={selectedExpression}
					resourceType="Expression"
					onClose={handleClosePopup}
				/>
			) : (
				<>
					<ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
						{currentExpressions.map((expression) => (
							<ExpressionElement
								key={expression._id}
								expression={expression}
								onClick={() => handleClick(expression)}
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

export default ExpressionList
