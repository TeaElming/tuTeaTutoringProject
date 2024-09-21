/** @format */

import { useState } from "react"
import Button from "../buttons/plainButton" // Assuming this is the updated Button

function PlainForm() {
	// State to hold the input value
	const [inputValue, setInputValue] = useState("")

	// Handle form submission
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevent the default form submission behavior
		console.log("Form submitted! The input value is:", inputValue)
		// Here I can add logic to process the data, such as sending it to a server
	}

	// Update the state with the input value
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Enter something..."
				value={inputValue}
				onChange={handleInputChange}
				required
			/>
			<Button type="submit" onClick={() => { } } className={""}>
				Submit
			</Button>
		</form>
	)
}

export default PlainForm
