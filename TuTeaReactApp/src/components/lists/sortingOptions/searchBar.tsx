/** @format */

import React from "react"
import styles from "./searchBar.module.css"

interface SearchBarProps {
	query: string
	onSearch: (query: string) => void
	placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
	query,
	onSearch,
	placeholder,
}) => {
	return (
		<input
			type="text"
			value={query}
			onChange={(e) => onSearch(e.target.value)}
			placeholder={placeholder || "Search..."}
			className={styles.searchInput}
		/>
	)
}

export default SearchBar
