/** @format */
import React from "react"
import { useNavigate } from "react-router-dom"

interface SessionExpiredModalProps {
	onLogout: () => void
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
	onLogout,
}) => {
	const navigate = useNavigate()

	const handleLogout = () => {
		onLogout() // Clear session storage and update auth state
		navigate("/start")
	}

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div style={{ padding: 20, backgroundColor: "#fff", borderRadius: 5 }}>
				<h2>Your session has expired.</h2>
				<button onClick={handleLogout}>Log Out</button>
			</div>
		</div>
	)
}

export default SessionExpiredModal
