import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'
import { wss } from './websocket-server.js'

try {
  await connectDB()

  const app = express()
  const port = process.env.PORT || 8083

  app.use(express.json())
  app.use(cors())
  app.use(helmet())
  app.use('/api/v1', router)

  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error('Bad JSON')
      return res.status(400).send({ error: 'Invalid JSON' })
    }
    next()
  })

  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log('Press CTRL-C to terminate...\n')
  })

  server.on('upgrade', (request, socket, head) => {
    console.log('Handling upgrade for WebSocket connection')
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
