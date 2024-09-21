/** @format */

import React, { useState, useEffect } from "react"

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

const GoalProgress: React.FC = () => {
	const [goals, setGoals] = useState<Goal[]>([])
	const [progressData, setProgressData] = useState<ProgressData[]>([])
	const [activities, setActivities] = useState<Record<string, Activity>>({})
	const [loading, setLoading] = useState<boolean>(true) // Track loading state

	useEffect(() => {
		const fetchGoals = async () => {
			try {
				const jwtToken = sessionStorage.getItem("jwt")
				const userId = sessionStorage.getItem("currentUserId")
				if (!jwtToken || !userId) {
					console.error("No JWT token or user ID found")
					return
				}

				const headers = {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				}

				const baseUrl =
					process.env.REACT_APP_TIMETRACKER_URL ||
					"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"

				const goalsURL = `${baseUrl}goals/${userId}`
				const response = await fetch(goalsURL, { headers })
				const data = await response.json()

				setGoals(data)

				// Fetch activities for each goal
				await fetchActivities(
					data.map((goal: Goal) => goal.activityId),
					headers
				)

				// Automatically select all goals and fetch progress data
				await fetchAllGoalProgress(data, headers)
			} catch (error) {
				console.error("Error fetching goals:", error)
			} finally {
				setLoading(false) // Loading is complete
			}
		}

		const fetchActivities = async (
			activityIds: string[],
			headers: HeadersInit
		) => {
			try {
				const baseUrl =
					process.env.REACT_APP_TIMETRACKER_ACTIVITIES_URL ||
					"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/activities"

				const activityPromises = activityIds.map(async (id) => {
					const activityUrl = `${baseUrl}/${id}`
					const response = await fetch(activityUrl, { headers })
					const activityData: Activity = await response.json()
					return { id, activityData }
				})

				const activitiesArray = await Promise.all(activityPromises)
				const activitiesMap: Record<string, Activity> = activitiesArray.reduce(
					(acc, { id, activityData }) => {
						acc[id] = activityData
						return acc
					},
					{} as Record<string, Activity>
				)

				setActivities(activitiesMap)
			} catch (error) {
				console.error("Error fetching activities:", error)
			}
		}

		const fetchAllGoalProgress = async (
			goals: Goal[],
			headers: HeadersInit
		) => {
			const baseUrl =
				process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"

			try {
				const progressPromises = goals.map(async (goal) => {
					const progressUrl = `${baseUrl}goals/${goal._id}/progress`
					const response = await fetch(progressUrl, { headers })
					if (!response.ok) throw new Error("Failed to fetch progress")
					const progressData: ProgressData = await response.json()
					return progressData
				})

				const progressResults = await Promise.all(progressPromises)
				setProgressData(progressResults)
			} catch (error) {
				console.error("Error fetching progress data:", error)
			}
		}

		fetchGoals()
	}, [])

	if (loading) return <p>Loading goals and progress data...</p>

	return (
		<div>
			<h1>Goal Progress</h1>
			{goals.length === 0 ? (
				<p style={{ color: "red" }}>No existing goals</p>
			) : (
				<div>
					{progressData.map((data) => (
						<div key={data.goal._id}>
							<h3>
								Goal: {activities[data.goal.activityId]?.name || "Loading..."}
							</h3>
							<ul>
								<li>Activity ID: {data.goal.activityId}</li>
								<li>Goal Duration: {data.goal.duration} minutes</li>
								<li>Period: {data.goal.period}</li>
								<li>
									Deadline: {new Date(data.goal.deadline).toLocaleDateString()}
								</li>
								<li>Total Logged: {data.totalLogged} minutes</li>
								<li>Progress: {data.progressPercentage.toFixed(2)}%</li>
							</ul>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default GoalProgress
