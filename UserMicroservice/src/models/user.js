import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import validator from 'validator'

const { isEmail } = validator

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      unique: false,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [8, 'Minimum password length is 8 characters'],
      maxlength: [255, 'Password must be at most 255 characters'],
    },
    pendingRelationships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PendingRelationship',
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    permissionLevel: {
      type: Number,
      required: true,
      default: 2, // 0 = admin, 1 = tutor, 2 = student
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true, // Show virtual fields in the JSON output
      transform: function (doc, ret) {
        delete ret._id // Remove '_id' field from the JSON output
        delete ret.__v // Remove '__v' field (version key) from the JSON output
      },
    },
  }
)

// Ensuring nice return of id as a string rather than object id
userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Hash password before saving, but only if it's modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// Authenticate user by comparing email and password
userSchema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email })
  if (!user) {
    throw new Error('User not found')
  }
  const match = await bcrypt.compare(password, user.password)
  if (match) {
    return user
  }
  throw new Error('Invalid login credentials')
}

// Set default values for students and tutors arrays
userSchema.path('students').default(() => [])
userSchema.path('tutors').default(() => [])

export const User = mongoose.model('User', userSchema)
