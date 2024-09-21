/** @format */

import React, { useState, useEffect } from "react"
import ActivitySelector from "../activities/activitySelector"

interface AggregatedData {
	activityId: string
	totalDuration: number
	logIds: string[] // Updated to include the array of log IDs
}

const AggregatedLogs: React.FC = () => {
	const currentYear = new Date().getFullYear()
	const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([])
	const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([])
	const [startDate, setStartDate] = useState<string>(`${currentYear}-01-01`)
	const [endDate, setEndDate] = useState<string>(`${currentYear}-12-31`)

	useEffect(() => {
		// Fetch all activities by default and select them
		const fetchActivities = async () => {
			try {
				const jwtToken = sessionStorage.getItem("jwt")
				if (!jwtToken) {
					console.error("No JWT token found")
					return
				}

				const headers = {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				}

				const activityUrl =
					process.env.REACT_APP_TIMETRACKER_ACTIVITIES_URL ||
					"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/activities"

				const response = await fetch(activityUrl, { headers })
				const data = await response.json()

				const allActivityIds = data.map(
					(activity: { id: string }) => activity.id
				)
				setSelectedActivityIds(allActivityIds)

				// Fetch data for all activities once they're loaded and selected
				fetchAggregatedData(allActivityIds)
			} catch (error) {
				console.error("Error fetching activities:", error)
			}
		}

		fetchActivities()
	}, [])

	const fetchAggregatedData = async (activityIds: string[]) => {
		const jwtToken = sessionStorage.getItem("jwt")
		if (!jwtToken) {
			console.error("No JWT token found")
			return
		}

		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		}

		const baseUrl =
			process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
		const aggregatedURL = `${baseUrl}timelogs/aggregate`

		try {
			const aggregatedResults: AggregatedData[] = []

			for (const activityId of activityIds) {
				const body = {
					activityId,
					startDate,
					endDate,
				}

				const response = await fetch(aggregatedURL, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				})

				const result = await response.json()

				if (response.ok && result.length > 0) {
					aggregatedResults.push({
						activityId,
						totalDuration: result[0].totalDuration || 0,
						logIds: result[0].logIds || [], // Capture the log IDs
					})
				} else {
					aggregatedResults.push({
						activityId,
						totalDuration: 0,
						logIds: [], // Empty log IDs if no data found
					})
				}
			}

			setAggregatedData(aggregatedResults)
		} catch (error) {
			console.error("Error fetching aggregated data:", error)
		}
	}

	const handleActivitySelect = (selectedIds: string[]) => {
		setSelectedActivityIds(selectedIds)
		// Automatically fetch data whenever activities are selected/deselected
		fetchAggregatedData(selectedIds)
	}

	return (
		<div>
			<h1>Aggregated Time Logs</h1>
			<div>
				<h2>Select Date Range</h2>
				<div>
					<label>
						Start Date:
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							required
						/>
					</label>
				</div>
				<div>
					<label>
						End Date:
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							required
						/>
					</label>
				</div>

				<h2>Select Activities</h2>
				<ActivitySelector onActivitySelect={handleActivitySelect} />
			</div>

			<h2>Aggregated Results</h2>
			<ul>
				{aggregatedData.map((data) => (
					<li key={data.activityId}>
						Activity ID: {data.activityId} - Total Duration:{" "}
						{data.totalDuration} minutes
						<ul>
							{data.logIds.map((logId) => (
								<li key={logId}>Log ID: {logId}</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

export default AggregatedLogs
