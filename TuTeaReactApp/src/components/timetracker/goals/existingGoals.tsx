/** @format */

import React, { useState, useEffect } from "react"
import styles from "./css/existingGoals.module.css"

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

interface ExistingGoalsProps {
	onGoalSelect: (selectedGoals: Goal[]) => void
}

const ExistingGoals: React.FC<ExistingGoalsProps> = ({ onGoalSelect }) => {
	const [goals, setGoals] = useState<Goal[]>([])
	const [activities, setActivities] = useState<Record<string, Activity>>({})
	const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])

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
			} catch (error) {
				console.error("Error fetching goals:", error)
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

		fetchGoals()
	}, [])

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.target
		const goal = goals.find((g) => g._id === value)

		if (!goal) return

		setSelectedGoals((prevSelectedGoals) => {
			const updatedGoals = checked
				? [...prevSelectedGoals, goal]
				: prevSelectedGoals.filter((g) => g._id !== value)

			// Pass the selected goal objects to the parent component
			onGoalSelect(updatedGoals)

			return updatedGoals
		})
	}

	return (
		<div className={styles.container}>
			{goals.length === 0 ? (
				<p style={{ color: "red" }}>No existing goals</p>
			) : (
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Checked</th>
							<th>Activity</th>
							<th>Duration</th>
							<th>Period</th>
							<th>Deadline</th>
						</tr>
					</thead>
					<tbody>
						{goals.map((goal) => (
							<tr key={goal._id}>
								<td>
									<input
										type="checkbox"
										value={goal._id}
										onChange={handleCheckboxChange}
									/>
								</td>
								<td>
									{goal.activityId} -{" "}
									{activities[goal.activityId]?.name || "Loading..."}
								</td>
								<td>{goal.duration} minutes</td>
								<td>{goal.period}</td>
								<td>
									{goal.isOpenEnded
										? "Open-ended"
										: new Date(goal.deadline).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default ExistingGoals
