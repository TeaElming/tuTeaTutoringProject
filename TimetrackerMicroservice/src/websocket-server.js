import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ noServer: true })

wss.on('connection', (ws, request) => {
  ws.clientUrl = request.url
  console.log('Client connected from URL:', ws.clientUrl)

  ws.on('message', (message) => {
    console.log(`Received message from ${ws.clientUrl}: ${message}`)
  })

  ws.on('close', (code, reason) => {
    console.log(
      `Client from ${ws.clientUrl} disconnected with code ${code} and reason ${reason}`,
    )
  })

  ws.on('error', (error) => {
    console.error(`Error on connection with ${ws.clientUrl}:`, error)
  })
})

function broadcast(data) {
  console.log('Broadcasting data:', data)
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // WebSocket.OPEN is typically 1
      console.log(`Broadcasting to client URL: ${client.clientUrl}`)
      client.send(JSON.stringify(data))
    }
  })
}

export { wss, broadcast }
