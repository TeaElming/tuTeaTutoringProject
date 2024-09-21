import mongoose from 'mongoose'

const sentenceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sentence: {
    type: String,
    required: true,
  },
  semanticTranslation: {
    type: String,
    required: false,
    default: 'No translation available',
  },
  directTranslation: {
    type: String,
    required: false,
    default: 'No translation available',
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

// Compound index to ensure sentence uniqueness per owner
sentenceSchema.index({ owner: 1, sentence: 1 }, { unique: true })

// Ensuring nice return of id as a string rather than object id
sentenceSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const Sentence = mongoose.model('Sentence', sentenceSchema)
