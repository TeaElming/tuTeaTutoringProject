import mongoose from 'mongoose'

const grammaticalRuleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rule: {
    type: String,
    required: true,
  },
  description: {
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
  examples: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Example',
    },
  ],
})

// Compound index to ensure rule uniqueness per owner
grammaticalRuleSchema.index({ owner: 1, rule: 1 }, { unique: true })

grammaticalRuleSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const GrammaticalRule = mongoose.model(
  'GrammaticalRule',
  grammaticalRuleSchema
)
