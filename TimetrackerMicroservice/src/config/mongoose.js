import mongoose from 'mongoose'
import { config } from 'dotenv'

/**
 * Connect to the MongoDB database.
 *
 * @returns {Promise<mongoose.Connection>} The Mongoose connection.
 */
export const connectDB = async () => {
  config()
  const { connection } = mongoose
  console.log("Trying to conenct to the database")

  connection.on('connected', () => {
    console.log('MongoDB connected')
  })
  connection.on('error', (err) => {
    console.log('MongoDB connection error: ', err)
  })
  connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
  })

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    connection.close(() => {
      console.log('Mongoose connection disconnected through app termination')
      process.exit(0)
    })
  })

  // Connect to the server.
  return mongoose.connect(process.env.DB_CONNECTION_STRING)
}
