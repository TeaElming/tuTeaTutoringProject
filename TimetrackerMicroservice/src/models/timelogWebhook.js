import mongoose from 'mongoose'

const timelogWebhookSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['timelogCreated', 'timelogUpdated', 'timelogDeleted'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  timelogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timelog',
    required: true,
  },
  timelogData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
})

export const TimelogWebhook = mongoose.model(
  'TimelogWebhook',
  timelogWebhookSchema,
)
