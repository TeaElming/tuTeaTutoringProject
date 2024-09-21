import mongoose from 'mongoose'

const relationshipSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmedAt: {
    type: Date,
  },
})

// Ensuring nice return of id as a string rather than object id
relationshipSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

relationshipSchema.set('toJSON', {
  virtuals: true,
})

export const Relationship = mongoose.model('Relationship', relationshipSchema)
