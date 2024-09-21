import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http' // Import Node's http module to create the server
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'
import { wss } from './websocket-server.js' // Import the WebSocketServer

try {
  await connectDB()
  console.log('Connected to MongoDB...')

  const app = express()
  const port = process.env.PORT || 8080

  app.use(express.json())
  app.use(cors())
  app.use(helmet())
  app.use('/api/v1', router)

  // Create the HTTP server and bind the Express app to it
  const server = http.createServer(app)

  // Bind the WebSocket server to the HTTP server to handle WebSocket upgrades
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  })

  // Start the server
  server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
    console.log('Press CTRL-C to terminate...\n')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
