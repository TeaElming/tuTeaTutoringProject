import mongoose from 'mongoose'

const webhookSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['postCreated', 'postUpdated', 'postDeleted'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  postData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
})

export const Webhook = mongoose.model('Webhook', webhookSchema)
