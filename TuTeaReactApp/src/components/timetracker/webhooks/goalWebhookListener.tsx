/** @format */

import React, { useEffect } from "react"

interface GoalWebhookListenerProps {
	onEvent: (event: any) => void
}

const GoalWebhookListener: React.FC<GoalWebhookListenerProps> = ({
	onEvent,
}) => {
	const wsGoalUrl =
		process.env.REACT_APP_WS_TIMETRACKER_URL || "wss://cscloud8-85.lnu.se/tuTea/timetracker-service/ws"

	let ws: WebSocket | null = null

	const connectWebSocket = () => {
		ws = new WebSocket(wsGoalUrl)

		ws.onopen = () => {
			console.log("Connected to Goal WebSocket server")
		}

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data)
				onEvent(data)
			} catch (error) {
				console.error("Error parsing Goal WebSocket message:", error)
			}
		}

		ws.onclose = (event) => {
			console.log(
				`Disconnected from Goal WebSocket server with code: ${
					event.code
				}, reason: ${event.reason || "No reason given"}`
			)
			// Attempt to reconnect after a delay
			setTimeout(() => {
				console.log("Attempting to reconnect to Goal WebSocket server...")
				connectWebSocket()
			}, 5000) // 5-second delay before reconnecting
		}

		ws.onerror = (error) => {
			console.error("Goal WebSocket error:", error)
			// Attempt to close the WebSocket cleanly
			if (ws) {
				ws.close()
			}
		}
	}

	useEffect(() => {
		if (!wsGoalUrl) {
			console.error("Goal WebSocket URL is not defined")
			return
		}

		connectWebSocket()

		return () => {
			if (ws) {
				ws.close()
			}
		}
	}, [wsGoalUrl])

	return null
}

export default GoalWebhookListener
