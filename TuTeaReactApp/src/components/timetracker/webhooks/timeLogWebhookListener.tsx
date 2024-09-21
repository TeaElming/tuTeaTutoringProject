/** @format */

import React, { useEffect } from "react"

// Define the structure of the event data
interface TimeLogWebhookListenerProps {
	onEvent: (event: any) => void
}

const TimeLogWebhookListener: React.FC<TimeLogWebhookListenerProps> = ({
	onEvent,
}) => {
	const wsTimelogUrl =
		process.env.REACT_APP_WS_TIMETRACKER_URL || "wss://cscloud8-85.lnu.se/tuTea/timetracker-service/ws"

	let ws: WebSocket | null = null

	const connectWebSocket = () => {
		ws = new WebSocket(wsTimelogUrl)

		ws.onopen = () => {
			console.log("Connected to timelog WebSocket server")
		}

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data)
				onEvent(data)
			} catch (error) {
				console.error("Error parsing timelog WebSocket message:", error)
			}
		}

		ws.onclose = (event) => {
			console.log(
				`Disconnected from timelog WebSocket server with code: ${
					event.code
				}, reason: ${event.reason || "No reason given"}`
			)
			// Attempt to reconnect after a delay
			setTimeout(() => {
				console.log("Attempting to reconnect to timelog WebSocket server...")
				connectWebSocket()
			}, 5000) // 5-second delay before reconnecting
		}

		ws.onerror = (error) => {
			console.error("timelog WebSocket error:", error)
			// Attempt to close the WebSocket cleanly
			if (ws) {
				ws.close()
			}
		}
	}

	useEffect(() => {
		if (!wsTimelogUrl) {
			console.error("timelog WebSocket URL is not defined")
			return
		}

		connectWebSocket()

		return () => {
			if (ws) {
				ws.close()
			}
		}
	}, [wsTimelogUrl])

	return null
}

export default TimeLogWebhookListener
