/** @format */

import React, { useState, useEffect } from "react"
import { useNavigate, Link, Outlet } from "react-router-dom"
import "./App.css"
import CustomNavbar from "./components/visuals/navBar"
import MainBackgroundDiv from "./components/visuals/mainBackground"
import CustomFooter from "./components/visuals/footer"
import Logo from "./components/visuals/bad_logo.png"
import SessionExpiredModal from "./routes/sessionExpiredMdal"

function App() {
	const navigate = useNavigate()
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
		!!sessionStorage.getItem("jwt")
	)
	const [showSessionExpired, setShowSessionExpired] = useState(false)

	// Handle login updates the session and also resets the expiration timeout
	const handleLogin = (token: string) => {
		sessionStorage.setItem("jwt", token)
		setIsLoggedIn(true)
		resetSessionTimeout()
	}

	// Handle logout clears the session and navigates to start
	const handleLogout = () => {
		sessionStorage.clear()
		setIsLoggedIn(false)
		setShowSessionExpired(false)
		navigate("/start")
	}

	// Reset the session timeout
	const resetSessionTimeout = () => {
		setTimeout(() => {
			setShowSessionExpired(true)
		}, 7200000) // 2 hours expressed in milliseconds 7200000
	}

	// Effect to initialize or clear the session timeout based on login status
	useEffect(() => {
		if (isLoggedIn) {
			resetSessionTimeout()
		} else {
			setShowSessionExpired(false)
		}
	}, [isLoggedIn])

	return (
		<div className="app-container">
			<CustomNavbar
				className="customNav"
				isLoggedIn={isLoggedIn}
				onLogout={handleLogout}
			/>
			<div className="content">
				<MainBackgroundDiv className="customBack">
					<h1 className="my-app-heading">
						<Link to="home">
							<img src={Logo} alt="T" className="logo-image" />
						</Link>
					</h1>
					<Outlet context={{ handleLogin, isLoggedIn }} />
				</MainBackgroundDiv>
			</div>
			<CustomFooter className="customFoot" />
			{showSessionExpired && <SessionExpiredModal onLogout={handleLogout} />}
		</div>
	)
}

export default App
