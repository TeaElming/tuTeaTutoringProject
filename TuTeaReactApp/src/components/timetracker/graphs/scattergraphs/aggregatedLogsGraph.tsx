/** @format */

import React, { useState, useEffect, useReducer, useRef } from "react"
import "./css/aggregatedLogsGraph.css"
import ActivitySelector from "../../activities/activitySelector"
import ScatterChartSection from "./helpers/scatterChartSection"
import DateRangeSelector from "./helpers/dateRangeSelector"
import CustomLegend from "./helpers/customLegend"
import { Symbols } from "recharts"
import TimeLogWebhookListener from "../../webhooks/timeLogWebhookListener" // Import the WebSocket listener

// Types for data
interface AggregatedData {
	activityId: string
	totalDuration: number
	logIds: string[]
}

interface LogDetail {
	_id: string
	userId: string
	activityId: string
	goalId: string | null
	comment: string | null
	duration: number
	timestamp: string
}

// Custom shape components mapping
const shapes: Record<string, React.FC<any>> = {
	circle: (props) => <Symbols {...props} type="circle" />,
	triangle: (props) => <Symbols {...props} type="triangle" />,
	diamond: (props) => <Symbols {...props} type="diamond" />,
	cross: (props) => <Symbols {...props} type="cross" />,
	star: (props) => <Symbols {...props} type="star" />,
	wye: (props) => <Symbols {...props} type="wye" />,
}

// Add a reducer to force a re-render when called
const forceUpdateReducer = (x: number) => x + 1

const AggregatedLogsGraph: React.FC = () => {
	// Helper functions
	const getHeaders = (jwtToken: string) => ({
		"Content-Type": "application/json",
		Authorization: `Bearer ${jwtToken}`,
	})

	const getActivityUrl = () => {
		return (
			process.env.REACT_APP_TIMETRACKER_ACTIVITIES_URL ||
			"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/activities"
		)
	}

	const getAggregatedDataUrl = () => {
		return `${
			process.env.REACT_APP_TIMETRACKER_URL ||
			"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
		}timelogs/aggregate`
	}

	const getLogDetailUrl = (logId: string) => {
		return `${
			process.env.REACT_APP_TIMETRACKER_URL ||
			"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
		}timelogs/${logId}`
	}

	const getActivityDetailUrl = (activityId: string) => {
		return `${
			process.env.REACT_APP_TIMETRACKER_URL ||
			"https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/"
		}activities/${activityId}`
	}

	const getFirstDayOfMonth = () => {
		const date = new Date()
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			"0"
		)}-01`
	}

	const getLastDayOfMonth = () => {
		const date = new Date(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			0
		)
		return date.toISOString().split("T")[0]
	}

	const [, forceUpdate] = useReducer(forceUpdateReducer, 0)

	const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([])
	const selectedActivityIdsRef = useRef<string[]>([]) // useRef to maintain consistent access to selectedActivityIds

	const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([])
	const [logDetails, setLogDetails] = useState<LogDetail[]>([])
	const [activityDetails, setActivityDetails] = useState<Map<string, string>>(
		new Map()
	)
	const [startDate, setStartDate] = useState<string>(getFirstDayOfMonth())
	const [endDate, setEndDate] = useState<string>(getLastDayOfMonth())

	// Fetch activities on component mount
	useEffect(() => {
		fetchActivities()
	}, [])

	// Fetch activities from the server
	const fetchActivities = async () => {
		try {
			const jwtToken = sessionStorage.getItem("jwt")
			if (!jwtToken) {
				console.error("No JWT token found")
				return
			}

			const response = await fetch(getActivityUrl(), {
				headers: getHeaders(jwtToken),
			})

			if (!response.ok) {
				throw new Error("Failed to fetch activities")
			}

			const data = await response.json()
			const allActivityIds = data.map((activity: { id: string }) => activity.id)
			setSelectedActivityIds(allActivityIds)
			selectedActivityIdsRef.current = allActivityIds // Update ref with the current activity IDs
			fetchAggregatedData(allActivityIds)
		} catch (error) {
			console.error("Error fetching activities:", error)
		}
	}

	// Fetch aggregated data for the selected activities
	const fetchAggregatedData = async (activityIds: string[]) => {
		console.log("Inside fetchAggregatedData with activityIds:", activityIds)
		try {
			const jwtToken = sessionStorage.getItem("jwt")
			if (!jwtToken) {
				console.error("No JWT token found")
				return
			}

			const aggregatedResults = await Promise.all(
				activityIds.map(async (activityId) => {
					const response = await fetch(getAggregatedDataUrl(), {
						method: "POST",
						headers: getHeaders(jwtToken),
						body: JSON.stringify({ activityId, startDate, endDate }),
					})

					if (!response.ok) {
						console.error(`Failed to fetch data for activity: ${activityId}`)
						return { activityId, totalDuration: 0, logIds: [] }
					}

					const result = await response.json()
					console.log(`Fetched data for activity ${activityId}:`, result)
					return {
						activityId,
						totalDuration: result?.[0]?.totalDuration || 0,
						logIds: result?.[0]?.logIds || [],
					}
				})
			)

			setAggregatedData(aggregatedResults)
			console.log("Updated aggregatedData state:", aggregatedResults)

			const logIds = aggregatedResults.flatMap((result) => result.logIds)
			fetchLogDetails(logIds)
			fetchActivityDetails(activityIds)
		} catch (error) {
			console.error("Error fetching aggregated data:", error)
		}
	}

	// Fetch log details for the aggregated data
	const fetchLogDetails = async (logIds: string[]) => {
		try {
			const jwtToken = sessionStorage.getItem("jwt")
			if (!jwtToken) {
				console.error("No JWT token found")
				return
			}

			const logDetails = await Promise.all(
				logIds.map((logId) =>
					fetch(getLogDetailUrl(logId), { headers: getHeaders(jwtToken) }).then(
						(res) =>
							res.ok ? res.json() : Promise.reject("Failed to fetch log detail")
					)
				)
			)

			setLogDetails(logDetails)
		} catch (error) {
			console.error("Error fetching log details:", error)
		}
	}

	// Fetch activity details for the selected activities
	const fetchActivityDetails = async (activityIds: string[]) => {
		try {
			const jwtToken = sessionStorage.getItem("jwt")
			if (!jwtToken) {
				console.error("No JWT token found")
				return
			}

			const activities = await Promise.all(
				activityIds.map((activityId) =>
					fetch(getActivityDetailUrl(activityId), {
						headers: getHeaders(jwtToken),
					}).then((res) =>
						res.ok
							? res.json()
							: Promise.reject("Failed to fetch activity detail")
					)
				)
			)

			const activityMap = new Map<string, string>()
			activities.forEach((activity) =>
				activityMap.set(activity.id, activity.name)
			)
			setActivityDetails(activityMap)
		} catch (error) {
			console.error("Error fetching activity details:", error)
		}
	}

	// Handle activity selection from the selector component
	const handleActivitySelect = (selectedIds: string[]) => {
		setSelectedActivityIds(selectedIds)
		selectedActivityIdsRef.current = selectedIds // Update ref when activity selection changes
		fetchAggregatedData(selectedIds)
	}

	// Handle events from the timelog WebSocket listener
	const handleTimeLogWebhookEvent = async (event: any) => {
		console.log("Handling timelog webhook event:", event)

		if (
			event &&
			(event.eventType === "timelogCreated" ||
				event.eventType === "timelogUpdated" ||
				event.eventType === "timelogDeleted")
		) {
			console.log(
				"Triggering fetchAggregatedData due to WebSocket event with activity IDs:",
				selectedActivityIdsRef.current
			)

			// Use ref to get the current selected activity IDs
			await fetchAggregatedData(selectedActivityIdsRef.current)
			console.log("Completed fetchAggregatedData in webhook update")

			// Force a component update after fetching data
			forceUpdate()
			console.log("Forced component update")
		}
	}

	// Transform log details into a format suitable for the chart
	const dataForChart = logDetails.map((log) => ({
		x: new Date(log.timestamp).getTime(),
		y: log.duration,
		z: log.duration,
		activityId: log.activityId,
		date: new Date(log.timestamp).toLocaleDateString(),
		duration: log.duration,
		activityName: activityDetails.get(log.activityId) || "Unknown",
		comment: log.comment,
	}))

	return (
		<div className="aggregatedLogsGraphContainer">
			<h2 className="graphTitle">Aggregated Time Logs</h2>
			{/* WebSocket listener for timelog events */}
			<TimeLogWebhookListener onEvent={handleTimeLogWebhookEvent} />
			<ScatterChartSection
				data={dataForChart}
				xDomain={[new Date(startDate).getTime(), new Date(endDate).getTime()]}
				selectedActivityIds={selectedActivityIds}
				activityDetails={activityDetails}
				shapes={shapes}
			/>
			<DateRangeSelector
				startDate={startDate}
				endDate={endDate}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
			/>
			<ActivitySelector onActivitySelect={handleActivitySelect} />
			<CustomLegend
				selectedActivityIds={selectedActivityIds}
				activityDetails={activityDetails}
				shapes={shapes}
			/>
		</div>
	)
}

export default AggregatedLogsGraph
