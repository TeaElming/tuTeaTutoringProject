/** @format */

import React, { useState } from "react"
import Button from "../buttons/plainButton"
import styles from "./css/loginForm.module.css"

interface LoginFormProps {
	onLogin: (token: string) => void // Pass the token to the parent component
}

function LoginForm({ onLogin }: LoginFormProps) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			const response = await fetch(
				`${process.env.REACT_APP_USER_URL_AUTH}/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			)

			if (!response.ok) {
				// Authentication failed
				const errorMessage = await response.text()
				setError(errorMessage) // Handle error
			} else {
				// Authentication successful
				const { token, currentUser } = await response.json() // Modify to receive both token and currentUser
				console.log(token)
				sessionStorage.setItem("jwt", token) // Storing the token in sessionStorage
				sessionStorage.setItem("currentUserId", currentUser) // Storing the currentUser in sessionStorage

				// Set timeout to remove JWT after 2 hours (2 hours = 7200000 milliseconds)
        // In my backend, I have set it so that the JWT expires after 2h so I need the frontend to match that 
				setTimeout(() => {
					sessionStorage.removeItem("jwt")
				}, 7200000)

				console.log("--------------- In the login form -------------------")
				console.log(
					"JWT: " +
						sessionStorage.getItem("jwt") +
						"for Current User" +
						sessionStorage.getItem("currentUserId")
				)
				console.log("\n . \n")
				onLogin(token) // Pass the token to the parent component
			}
		} catch (error) {
			console.error("Error:", error)
			setError("An error occurred. Please try again.")
		}
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		switch (name) {
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

	return (
		<form onSubmit={handleSubmit} className={styles.formContainer}>
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
				Login
			</Button>
			{error && <div className={styles.error}>{error}</div>}
		</form>
	)
}

export default LoginForm
