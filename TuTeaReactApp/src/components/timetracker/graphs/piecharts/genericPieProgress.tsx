/** @format */

import React, { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts"
import GoalActions from "../edits/goalActions" // Ensure the path is correct
import "./css/genericPieChart.css"

interface GoalData {
	goal: {
		_id: string
		userId: string
		activityId: string
		duration: number
		period: string
		deadline: string
		isOpenEnded: boolean
		createdAt: string
	}
	totalLogged: number
	progressPercentage: number
}

interface Activity {
	id: string
	name: string
	type: string
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  fullValue: number;
  loggedMins: number;
}

const COLORS = {
	underAchievement: ["#FFFFFF", "#90EE90"], // White and Light Green
	overAchievement: ["#90EE90", "#008000"], // Light Green and Dark Green
}

const GenericPieProgress: React.FC<{ data: GoalData }> = ({ data }) => {
	const [activityName, setActivityName] = useState("")

	useEffect(() => {
		const fetchActivity = async () => {
			const jwtToken = sessionStorage.getItem("jwt")
			const headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			}

			const baseURL =
				process.env.REACT_APP_TIMETRACKER_ACTIVITIES_URL ||
				"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/activities"
			const activityUrl = `${baseURL}/${data.goal.activityId}`

			try {
				const response = await fetch(activityUrl, { headers })
				if (response.ok) {
					const activity = await response.json()
					setActivityName(activity.name)
				} else {
					console.error("Failed to fetch activity")
				}
			} catch (error) {
				console.error("Error fetching activity:", error)
			}
		}

		fetchActivity()
	}, [data.goal.activityId])

	const getStatus = () => {
		const { duration, isOpenEnded, deadline } = data.goal
		const remainingMins = duration - data.totalLogged
		const endDate = new Date(deadline)
		const today = new Date()
		const daysLeft = Math.ceil(
			(endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
		)

		if (data.progressPercentage < 100) {
			if (isOpenEnded) {
				return `${data.totalLogged}/${duration} - ${remainingMins} mins left`
			}
			return `${data.totalLogged}/${duration} - ${remainingMins} mins and ${daysLeft} days left`
		}
		return "You achieved your goal!"
	}

	let { progressPercentage, totalLogged, goal } = data

	// Ensure progressPercentage is formatted to two decimal points
	const formattedProgress = parseFloat(progressPercentage.toFixed(2))
	const remainingPercentage = parseFloat((100 - formattedProgress).toFixed(2))

  let chartData: ChartDataItem[] = [];


	if (formattedProgress < 100) {
		chartData = [
			{
				name: "Completed",
				value: formattedProgress,
				color: COLORS.underAchievement[1],
				fullValue: formattedProgress,
				loggedMins: totalLogged,
			},
			{
				name: "Remaining",
				value: remainingPercentage,
				color: COLORS.underAchievement[0],
				fullValue: remainingPercentage,
				loggedMins: goal.duration - totalLogged,
			},
		]
	} else if (formattedProgress === 100) {
		chartData = [
			{
				name: "Completed",
				value: 100,
				color: COLORS.underAchievement[1],
				fullValue: formattedProgress,
				loggedMins: totalLogged,
			},
		]
	} else {
		let b = formattedProgress % 100
		chartData = [
			{
				name: `Overachieved by`,
				value: b,
				color: COLORS.overAchievement[1],
				fullValue: formattedProgress - 100,
				loggedMins: totalLogged - goal.duration,
			},
			{
				name: `Total`,
				value: 100 - b,
				color: COLORS.overAchievement[0],
				fullValue: formattedProgress,
				loggedMins: totalLogged,
			},
		]
	}

	return (
		<div className="piechartDiv">
			<PieChart width={150} height={150}>
				<Pie
					data={chartData}
					cx={75}
					cy={75}
					innerRadius={40}
					outerRadius={70}
					fill="#8884d8"
					paddingAngle={5}
					dataKey="value"
				>
					{chartData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
					<Label
						value={`${formattedProgress}% (${totalLogged} mins)`}
						position="center"
						fill="#000"
						style={{ fontSize: "12px", fontWeight: "bold" }}
					/>
				</Pie>
				<Tooltip
					formatter={(value, name) => {
						const entry = chartData.find((x) => x.name === name)
						return entry
							? [
									`${entry.fullValue.toFixed(2)}% (${entry.loggedMins} mins)`,
									name,
							  ]
							: [`${name}: No data`, name]
					}}
				/>
			</PieChart>

			<div className="sideInfo">
				<p>
					<strong>Goal?</strong>{" "}
					{activityName
						? `${activityName} - ${data.goal.duration} mins/${data.goal.period}`
						: "Loading..."}
				</p>
				<p>
					<strong>When?</strong>{" "}
					{new Date(data.goal.createdAt).toLocaleDateString()} -{" "}
					{data.goal.isOpenEnded
						? "Open-ended"
						: new Date(data.goal.deadline).toLocaleDateString()}
				</p>
				<p>
					<strong>Status?</strong> {getStatus()}
				</p>
				{/* Integrating GoalActions component here */}
				<GoalActions goalId={goal._id} />
			</div>
		</div>
	)
}

export default GenericPieProgress
