/** @format */

import React, { useState } from "react"
import Button from "../buttons/plainButton"
import LoginForm from "../forms/loginForm"
import RegistrationForm from "../forms/registrationForm"
import { useNavigate } from "react-router-dom"

interface StartingPageProps {
	onLogin: (token: string) => void
}

function StartingPage({ onLogin }: StartingPageProps) {
	const [showLoginForm, setShowLoginForm] = useState(true)
	const [registrationSuccess, setRegistrationSuccess] = useState(false)
	const [registrationError, setRegistrationError] = useState<string | null>(null) // State for error message
	const navigate = useNavigate()

	const handleLogin = (token: string) => {
		sessionStorage.setItem("jwt", token)
		onLogin(token)
		navigate("/home")
	}

	const handleLoginClick = () => {
		setShowLoginForm(true)
		setRegistrationSuccess(false) // Hide success message when switching to login
		setRegistrationError(null) // Hide error message when switching to login
	}

	const handleRegisterClick = () => {
		setShowLoginForm(false)
		setRegistrationSuccess(false) // Hide success message when switching to register
		setRegistrationError(null) // Hide error message when switching to register
	}

	const handleRegistrationSuccess = () => {
		setRegistrationSuccess(true)
		setShowLoginForm(true) // Switch back to the login form after successful registration
		setRegistrationError(null) // Clear any existing error messages
	}

	const handleRegistrationError = () => {
		setRegistrationError("Registration failed. Try a different email.") // Set the error message when registration fails
		setRegistrationSuccess(false) // Ensure success message is not shown
	}

	return (
		<div>
			{registrationSuccess && (
				<div style={{ color: "green", marginBottom: "10px" }}>
					Registration successful. Please log in with your new credentials.
				</div>
			)}
			{registrationError && (
				<div style={{ color: "red", marginBottom: "10px" }}>
					{registrationError}
				</div>
			)}
			<div>
				<Button
					onClick={handleLoginClick}
					className={showLoginForm ? "activeButton" : ""}
				>
					Login
				</Button>
				<Button
					onClick={handleRegisterClick}
					className={!showLoginForm ? "activeButton" : ""}
				>
					Register
				</Button>
				{showLoginForm ? (
					<LoginForm onLogin={handleLogin} />
				) : (
					<RegistrationForm
						onRegistrationSuccess={handleRegistrationSuccess}
						onRegistrationError={handleRegistrationError} // Pass error handler to RegistrationForm
					/>
				)}
			</div>
		</div>
	)
}

export default StartingPage
