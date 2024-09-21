/** @format */

import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { createRouter } from "./routes/routes"

// Define the handleLogin function to manage login and token storage
const handleLogin = (token: string) => {
	sessionStorage.setItem("jwt", token)
}

// Function to check if the user is authenticated based on the presence of a token
const checkAuthentication = () => !!sessionStorage.getItem("jwt")

const MainApp = () => {
	// State to manage authentication status
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		checkAuthentication()
	)

	// Effect to update authentication state on login
	useEffect(() => {
		const updateAuthState = () => setIsAuthenticated(checkAuthentication())
		window.addEventListener("storage", updateAuthState) // Listen for sessionStorage changes

		return () => {
			window.removeEventListener("storage", updateAuthState)
		}
	}, [])

	// Initialize the router with the handleLogin function and isAuthenticated state
	const router = createRouter(handleLogin, isAuthenticated)

	return <RouterProvider router={router} />
}

// Create the root and render the MainApp component
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<React.StrictMode>
		<MainApp />
	</React.StrictMode>
)
