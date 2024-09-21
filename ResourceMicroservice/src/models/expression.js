import mongoose from 'mongoose'

const expressionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expression: {
    type: String,
    required: true,
  },
  directTranslation: {
    type: String,
    required: false,
    default: 'No translation available',
  },
  nativeEquivalent: {
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

// Compound index to ensure expression uniqueness per owner
expressionSchema.index({ owner: 1, expression: 1 }, { unique: true })

// Ensuring nice return of id as a string rather than object id
expressionSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const Expression = mongoose.model('Expression', expressionSchema)
