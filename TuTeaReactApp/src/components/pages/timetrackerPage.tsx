/** @format */

import React, { useEffect, useState } from "react"
import "./css/timetrackerPage.css"
import GoalsDashboard from "../timetracker/graphs/piecharts/allGoalsPieChart"
import AggregatedLogsSelector from "../timetracker/graphs/graphSelector/aggregatedLogsSelector"
import AdditionPopup from "../timetracker/popUps/additionPopup"

const TimetrackerPage: React.FC = () => {
	const [username, setUsername] = useState("")
	const [isPopupOpen, setIsPopupOpen] = useState(false)

	const handleOpenPopup = () => {
		setIsPopupOpen(true)
	}

	const handleClosePopup = () => {
		setIsPopupOpen(false)
	}

	useEffect(() => {
		const fetchUser = async () => {
			const userId = sessionStorage.getItem("currentUserId")
			const jwtToken = sessionStorage.getItem("jwt")
			if (userId && jwtToken) {
				try {
					const response = await fetch(
						`${process.env.REACT_APP_USER_URL_USERS}/${userId}`,
						{
							headers: {
								Authorization: `Bearer ${jwtToken}`, // Include JWT token in the request headers
							},
						}
					)
					if (response.ok) {
						const user = await response.json()
						setUsername(user.name) // Assuming the user object has a 'name' field
					} else {
						console.error("Error fetching user:", response.statusText)
					}
				} catch (error) {
					console.error("Error fetching user:", error)
				}
			}
		}

		fetchUser()
	}, [])

	return (
		<div className="wholeTrackerPage">
			<div className="timeAdderButton">
				<button onClick={handleOpenPopup}>Create Goal or Log Time</button>
				<AdditionPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
			</div>
			<div className="timetrackerPageContainer">
				<div className="component1">
					<GoalsDashboard />
				</div>
				<div className="component2">
					<AggregatedLogsSelector />
				</div>
			</div>
		</div>
	)
}

export default TimetrackerPage
