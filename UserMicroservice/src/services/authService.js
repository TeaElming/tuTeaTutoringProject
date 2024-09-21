import fs from 'fs'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

export class AuthService {
  constructor() {
    this.privateKey = fs.readFileSync('./private.pem', 'utf8')
  }

  async registerUser(name, email, password, permissionLevel = 2) {
    try {
      console.log('Registration attempt:', name, email, permissionLevel) // Log the registration attempt

      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new Error('User already exists with this email')
      }

      // Create a new user instance
      const user = new User({
        name,
        email,
        password, // Password will be hashed in the 'pre save' hook of userSchema
        permissionLevel, // Use the permission level passed from the front end
      })

      // Save the user to the database
      await user.save()

      console.log('Registered user:', user.id) // Log the newly registered user

      return { userId: user.id, message: 'User successfully registered' }
    } catch (error) {
      console.error('Error registering user:', error) // Log any errors that occur during registration
      throw new Error('Error during user registration')
    }
  }

  async loginUser(email, password) {
    try {
      console.log('Login attempt:', email) // Log the login attempt

      const user = await User.authenticate(email, password)

      if (!user) {
        throw new Error('User not found')
      }

      console.log('Authenticated user:', user.id) // Log the authenticated user

      // Create JWT payload with necessary user information
      const payload = {
        sub: user.id,
        name: user.name,
        permissionLevel: user.permissionLevel,
        students:
          user.permissionLevel === 1
            ? user.students.map((student) => student.toString())
            : [], // Embed student IDs if the user is a tutor
      }

      console.log("These are students for the user: ", payload.students)

      // Sign the token
      const token = jwt.sign(payload, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: '2h', // Adjust if needed
      })

      console.log('Token:', token, 'for user: ', user.id, "with permissionLevel: ", user.permissionLevel, " and students: ",  ) // Log the token

      return { token, currentUser: user.id, permissionLevel: user.permissionLevel, students: payload.students } // Return both token and user ID in the response
    } catch (error) {
      console.error('Error logging in:', error) // Log any errors that occur during login
      throw new Error('Invalid email or password')
    }
  }

  async quickAuth(token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, this.privateKey, {
        algorithms: ['RS256'],
      })

      console.log('Token valid for', decoded.sub) // Log the user id for whom the token is valid

      // Optionally check if the user still exists in the database
      const user = await User.findById(decoded.sub)
      if (!user) {
        throw new Error('User not found')
      }

      return true
    } catch (error) {
      console.error('Error verifying token:', error) // Log any errors that occur during token verification
      return false
    }
  }
}
