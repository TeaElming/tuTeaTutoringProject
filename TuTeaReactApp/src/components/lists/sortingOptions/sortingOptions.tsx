/** @format */

import React from "react"

interface SortingOptionsProps {
	sortOption: string
	onSortChange: (option: string) => void
}

const SortingOptions: React.FC<SortingOptionsProps> = ({
	sortOption,
	onSortChange,
}) => {
	const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onSortChange(event.target.value)
	}

	return (
		<div>
			<label>
				<input
					type="radio"
					value="new-old"
					checked={sortOption === "new-old"}
					onChange={handleSortChange}
				/>
				New-Old
			</label>
			<label>
				<input
					type="radio"
					value="old-new"
					checked={sortOption === "old-new"}
					onChange={handleSortChange}
				/>
				Old-New
			</label>
			<label>
				<input
					type="radio"
					value="a-z"
					checked={sortOption === "a-z"}
					onChange={handleSortChange}
				/>
				A-Z 🇸🇪
			</label>
			<label>
				<input
					type="radio"
					value="z-a"
					checked={sortOption === "z-a"}
					onChange={handleSortChange}
				/>
				Z-A 🇸🇪
			</label>
			<label>
				<input
					type="radio"
					value="a-z-native"
					checked={sortOption === "a-z-native"}
					onChange={handleSortChange}
				/>
				A-Z 🇬🇧
			</label>
			<label>
				<input
					type="radio"
					value="z-a-native"
					checked={sortOption === "z-a-native"}
					onChange={handleSortChange}
				/>
				Z-A 🇬🇧
			</label>
		</div>
	)
}

export default SortingOptions
