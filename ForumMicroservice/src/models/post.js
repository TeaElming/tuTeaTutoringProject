import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  response: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  access: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true,
  },
  privateAccessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Relationship',
    required: function () {
      return this.access === 'private'
    },
  },
})

export const Post = mongoose.model('Post', postSchema)
