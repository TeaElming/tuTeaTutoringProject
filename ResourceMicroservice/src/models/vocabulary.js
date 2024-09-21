import mongoose from 'mongoose'

const vocaublarySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  word: {
    type: String,
    required: true,
  },
  translation: {
    type: [String],
    default: ['No translation available'],
  },
  wordGroup: {
    type: String,
    required: false,
    default: 'General',
    enum: [
      'General',
      'Noun',
      'Pronoun',
      'Verb',
      'Adjective',
      'Adverb',
      'Preposition',
      'Conjunction',
      'Interjection',
    ],
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

// Compound index to ensure word uniqueness per owner - avoids issues with e.g. prefilling the database
vocaublarySchema.index({ owner: 1, word: 1 }, { unique: true })

// Ensuring nice return of id as a string rather than object id
vocaublarySchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const Vocabulary = mongoose.model('Vocabulary', vocaublarySchema)
