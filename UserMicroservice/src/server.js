import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'

try {
  await connectDB()

  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())
  app.use(cors())
  app.use(helmet())
  app.use('/api/v1', router)
  app.listen(port, () => {
    console.log(`Server is running on port ${process.env.BASE_URL}${port}`)
    console.log('Press CTRL-C to terminate...\n')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
