import mongoose from 'mongoose'

const timelogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  }, // User ID from JWT
  activityId: {
    type: String,
    required: true,
  }, // Reference to predefined activity ID as a string
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
  }, // Optional reference to a Goal
  comment: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: true,
  }, // Duration logged in minutes
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

export const Timelog = mongoose.model('Timelog', timelogSchema)
