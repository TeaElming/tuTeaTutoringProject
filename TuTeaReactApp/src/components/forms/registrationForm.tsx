/** @format */

import React, { useState } from "react"
import Button from "../buttons/plainButton" // Ensure this path matches where your Button component is located.
import styles from "./css/registrationForm.module.css"

interface RegistrationFormProps {
	onRegister?: () => void // Add a prop to handle registration logic
	onRegistrationSuccess: () => void // Add a prop to handle registration success
	onRegistrationError: (error: string) => void // New prop to handle registration errors
}

function RegistrationForm({
	onRegister,
	onRegistrationSuccess,
	onRegistrationError,
}: RegistrationFormProps) {
	// State to hold the input values
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [permissionLevel, setPermissionLevel] = useState(2) // Default to 2 (Student)

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevent the default form submission behavior
		try {
			const response = await fetch(
				`${process.env.REACT_APP_USER_URL_AUTH}/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name, email, password, permissionLevel }),
				}
			)

			if (response.ok) {
				// Registration successful
				onRegistrationSuccess()
			} else {
				// Registration failed
				const errorMessage = await response.text() // Extract the error message from the response
				onRegistrationError(errorMessage) // Pass the error message to the error handler
			}
		} catch (error) {
			console.error("Error:", error)
			onRegistrationError("An unexpected error occurred. Please try again.") // Handle unexpected errors
		}
	}

	// Generalized change handler
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		switch (name) {
			case "name":
				setName(value)
				break
			case "email":
				setEmail(value)
				break
			case "password":
				setPassword(value)
				break
			default:
				break
		}
	}

	// Handle role change
	const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPermissionLevel(parseInt(event.target.value, 10))
	}

	return (
		<form className={styles.formContainer} onSubmit={handleSubmit}>
			<div className={styles.radioGroup}>
				<label>
					<input
						type="radio"
						name="role"
						value={2} // Student
						checked={permissionLevel === 2}
						onChange={handleRoleChange}
					/>
					Student
				</label>
				<label>
					<input
						type="radio"
						name="role"
						value={1} // Tutor
						checked={permissionLevel === 1}
						onChange={handleRoleChange}
					/>
					Tutor
				</label>
			</div>
			<input
				type="text"
				name="name"
				placeholder="Enter your name"
				className={styles.inputField}
				value={name}
				onChange={handleChange}
				required
			/>
			<input
				type="email"
				name="email"
				placeholder="Enter your email"
				className={styles.inputField}
				value={email}
				onChange={handleChange}
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Enter your password"
				className={styles.inputField}
				value={password}
				onChange={handleChange}
				required
			/>
			<Button type="submit" className={styles.button}>
				Register
			</Button>
		</form>
	)
}

export default RegistrationForm
