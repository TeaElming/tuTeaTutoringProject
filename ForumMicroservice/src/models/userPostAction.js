import mongoose from 'mongoose'

const userPostActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
})

userPostActionSchema.index({ userId: 1, postId: 1 }, { unique: true })

export const UserPostAction = mongoose.model(
  'UserPostAction',
  userPostActionSchema,
)
