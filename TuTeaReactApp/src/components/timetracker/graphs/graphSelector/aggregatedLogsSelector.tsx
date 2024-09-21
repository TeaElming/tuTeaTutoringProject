/** @format */

import React, { useState, useCallback } from "react"
import AggregatedLogsGraph from "../scattergraphs/aggregatedLogsGraph"
import HorizontalBarChart from "../barGraphs/aggregatedLogsHorizontal"
import TimeLogWebhookListener from "../../webhooks/timeLogWebhookListener" // Import the WebSocket listener

const AggregatedLogsSelector: React.FC = () => {
	const [selectedChart, setSelectedChart] = useState<"bar" | "scatter">("bar")
	const [refreshKey, setRefreshKey] = useState(0) // Key to trigger re-rendering

	// Handle toggling between charts
	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedChart(event.target.checked ? "scatter" : "bar")
	}

	// Function to force a refresh of the chart data
	const refreshCharts = useCallback(() => {
		setRefreshKey((prevKey) => prevKey + 1) // Change key to force re-render
	}, [])

	// Handle WebSocket events to refresh data
	const handleTimeLogWebhookEvent = (event: any) => {
		console.log("Handling timelog webhook event:", event)
		if (
			event &&
			(event.type === "timelogCreated" ||
				event.type === "timelogUpdated" ||
				event.type === "timelogDeleted")
		) {
			// Refresh charts when a relevant event is received
			refreshCharts()
		}
	}

	return (
		<div className="selectorContainer">
			{/* WebSocket listener for timelog events */}
			<TimeLogWebhookListener onEvent={handleTimeLogWebhookEvent} />
			<div className="toggleContainer">
				<span className="labelLeft">Bar</span>
				<label className="toggleLabel">
					<input
						type="checkbox"
						className="toggleInput"
						checked={selectedChart === "scatter"}
						onChange={handleToggleChange}
					/>
					<span className="slider"></span>
				</label>
				<span className="labelRight">Scatter</span>
			</div>
			<div className="chartContainer">
				{selectedChart === "bar" ? (
					<HorizontalBarChart key={refreshKey} /> // Use refreshKey to trigger re-render
				) : (
					<AggregatedLogsGraph key={refreshKey} /> // Use refreshKey to trigger re-render
				)}
			</div>
		</div>
	)
}

export default AggregatedLogsSelector
