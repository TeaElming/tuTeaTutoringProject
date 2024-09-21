/** @format */

import React, { useEffect } from "react"

interface ForumWebhookListenerProps {
	onEvent: (event: any) => void
}

const ForumWebhookListener: React.FC<ForumWebhookListenerProps> = ({
	onEvent,
}) => {
	const wsForumUrl = process.env.REACT_APP_WS_URL || "ws://localhost:8083"
	let ws: WebSocket | null = null

	const connectWebSocket = () => {
		ws = new WebSocket(wsForumUrl)

		ws.onopen = () => {
			console.log("Connected to Forum WebSocket server")
		}

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data)
				console.log("Received Forum WebSocket message:", data)
				onEvent(data)
			} catch (error) {
				console.error("Error parsing Forum WebSocket message:", error)
			}
		}

		ws.onclose = (event) => {
			console.log(
				`Disconnected from Forum WebSocket server with code: ${event.code}, reason: ${event.reason}`
			)
			// Attempt to reconnect after a delay
			setTimeout(() => {
				console.log("Attempting to reconnect to Forum WebSocket server...")
				connectWebSocket()
			}, 5000) // 5-second delay before reconnecting
		}

		ws.onerror = (error) => {
			console.error("Forum WebSocket error:", error)
		}
	}

	useEffect(() => {
		if (!wsForumUrl) {
			console.error("Forum WebSocket URL is not defined")
			return
		}

		connectWebSocket()

		return () => {
			if (ws) {
				ws.close()
			}
		}
	}, [wsForumUrl])

	return null // This component does not render any UI
}

export default ForumWebhookListener
