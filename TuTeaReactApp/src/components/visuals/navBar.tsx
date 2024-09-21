/** @format */

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "./bad_logo.png"
import "./css/navBar.css"

interface CustomNavbarProps {
	className?: string
  isLoggedIn: boolean
	onLogout: () => void
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ onLogout }) => {
	const navigate = useNavigate()

	const handleLogout = () => {
		const token = sessionStorage.getItem("jwt")
		if (token) {
			if (window.confirm("Are you sure you want to log out?")) {
				sessionStorage.removeItem("jwt") // Remove the JWT from session storage
				onLogout() // Trigger any additional logout logic (if needed later)
				navigate("/start") // Redirect to the start page
			}
		} else {
			alert("You are not logged in.")
		}
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<ul className="nav">
				<li className="nav-item">
					<Link className="nav-link active" to="home">
						Home
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="resources">
						Resources
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="time-tracker">
						Time Tracker
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="forum">
						Forum
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="games">
						Games
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="profile">
						Profile
					</Link>
				</li>
			</ul>

			<div className="navbar-brand">
				<Link to="home">
					<img src={Logo} alt="T" />
				</Link>
				<button onClick={handleLogout} className="logoutButton">
					Log Out
				</button>
			</div>
		</nav>
	)
}

export default CustomNavbar
