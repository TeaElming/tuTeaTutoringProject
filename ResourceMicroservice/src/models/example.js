/** @format */

import mongoose from 'mongoose'

const exampleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exampleTarget: { 
    type: String,
    required: true,
  },
  exampleNative: {
    type: String,
    required: true,
  },
  targetLanguage: {
    type: String,
    required: true,
  },
  nativeLanguage: {
    type: String,
    required: false, // should be possible to add later
  },
  comments: {
    type: String,
    required: false,
  },
  added: {
    type: Date,
    default: Date.now,
  },
})

// Ensuring nice return of id as a string rather than object id
// exampleSchema.virtual("id").get(function () { 	return this._id.toHexString() })
// Commented out because referencing the object id in other schemas - good or bad?

export const Example = mongoose.model('Example', exampleSchema)
