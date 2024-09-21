/** @format */

import React, { useState, useEffect } from "react"
import GenericPieProgress from "./genericPieProgress"
import GoalWebhookListener from "../../webhooks/goalWebhookListener"
import "./css/allGoalsPieChart.css"

interface Activity {
	id: string
	name: string
	type: string
}

interface Goal {
	_id: string
	userId: string
	activityId: string
	duration: number
	period: string
	deadline: string
	isOpenEnded: boolean
	createdAt: string
}

interface ProgressData {
	goal: Goal
	totalLogged: number
	progressPercentage: number
}

const GoalsDashboard: React.FC = () => {
	const [goals, setGoals] = useState<Goal[]>([])
	const [progressData, setProgressData] = useState<ProgressData[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	// Function to fetch goals and their progress data
	const fetchGoalsAndProgress = async () => {
		setLoading(true) // Set loading state to true when fetching data
		try {
			const jwtToken = sessionStorage.getItem("jwt")
			const userId = sessionStorage.getItem("currentUserId")
			if (!jwtToken || !userId) {
				console.error("No JWT token or user ID found")
				setLoading(false)
				return
			}

			const headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			}

			const baseUrl =
				process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
			const goalsURL = `${baseUrl}goals/${userId}`
			const response = await fetch(goalsURL, { headers })
			const goalsData = await response.json()
			setGoals(goalsData)

			// Fetch progress data for each goal
			const progressPromises = goalsData.map(async (goal: Goal) => {
				const progressUrl = `${baseUrl}goals/${goal._id}/progress`
				const progressResponse = await fetch(progressUrl, { headers })
				const progressData = await progressResponse.json()
				return progressData
			})

			const progressResults = await Promise.all(progressPromises)
			setProgressData(progressResults)
		} catch (error) {
			console.error("Error fetching goals and progress data:", error)
		} finally {
			setLoading(false) // Ensure loading state is set to false after fetch
		}
	}

	// Fetch goals and progress when the component mounts
	useEffect(() => {
		fetchGoalsAndProgress()
	}, [])

	// Handle events from the goal webhook
	const handleGoalWebhookEvent = (event: any) => {
    console.log("All goals webhook triggered!")
		if (
			event &&
			(event.eventType === "goalCreated" ||
				event.eventType === "goalUpdated" ||
				event.eventType === "goalDeleted" ||
				(event.eventType === "timelogCreated" &&
					event.timelog &&
					event.timelog.goalId != null)) // Include condition for timelog with goalId
		) {
			// Re-fetch goals and progress data when an event occurs
			fetchGoalsAndProgress()
		}
	}

	if (loading) return <p>Loading goals...</p>
	if (goals.length === 0) return <p>No goals found.</p>

	return (
		<div className="dashboardContainer">
			<h2 className="dashboardHeading">Goal Progression</h2>
			<GoalWebhookListener onEvent={handleGoalWebhookEvent} />
			<div className="goalsContainer">
				{progressData.map((data) => (
					<div key={data.goal._id} className="goalItem">
						<GenericPieProgress data={data} />
					</div>
				))}
			</div>
		</div>
	)
}

export default GoalsDashboard
