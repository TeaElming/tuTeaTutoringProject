import mongoose from 'mongoose'

const genericSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetLanguage: {
    type: String,
    required: true,
  },
  nativeLanguage: {
    type: String,
    required: false,
  },
  resource: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  added: {
    type: Date,
    default: Date.now,
  },
  examples: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Example',
  }],
})

// Compound index to ensure resource uniqueness per owner
genericSchema.index({ owner: 1, targetLanguage: 1 }, { unique: true })

// Ensuring nice return of id as a string rather than object id
genericSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const GenericResource = mongoose.model('GenericResource', genericSchema)
