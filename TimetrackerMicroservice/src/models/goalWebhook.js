import mongoose from 'mongoose'

const goalWebhookSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['goalCreated', 'goalUpdated', 'goalDeleted'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
  },
  goalData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
})

export const GoalWebhook = mongoose.model('GoalWebhook', goalWebhookSchema)
