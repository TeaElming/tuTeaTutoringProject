import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  }, // User ID from JWT
  activityId: {
    type: String,
    required: true,
  }, // Reference to predefined activity ID
  duration: {
    type: Number,
    required: true,
  }, // Duration goal in minutes
  period: {
    type: String,
    enum: ['day', 'week', 'month', 'year'],
    required: true,
  }, // Period for the goal
  deadline: {
    type: Date,
  }, // Optional deadline for the goal
  isOpenEnded: {
    type: Boolean,
    default: false,
  }, // Flag to indicate if the goal is open-ended
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Timestamp for goal creation
})

export const Goal = mongoose.model('Goal', goalSchema)
