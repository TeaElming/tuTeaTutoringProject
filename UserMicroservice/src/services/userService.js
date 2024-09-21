/** @format */

import { User } from '../models/user.js'

export class UserService {
  async getUserById(id) {
    try {
      const user = await User.findById(id)
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      throw new Error('Error finding user: ' + error.message)
    }
  }

  getUserIdByEmail(email) {
    try {
      const user = User.findOne({ email })
      if (!user) {
        throw new Error('Email does not match a user.')
      }
      return user
    } catch (error) {
      throw new Error('Error finding user with given email: ' + error.message)
    }
  }

  async updateUserById(id, updates) {
    try {
      const user = await User.findById(id)
      if (!user) {
        throw new Error('User not found')
      }

      // Apply updates to the user document
      if (updates.email) {
        // Ensure email uniqueness
        const existingEmail = await User.findOne({ email: updates.email })
        if (existingEmail && existingEmail._id.toString() !== id) {
          throw new Error('Email already exists')
        }
        user.email = updates.email
      }

      if (updates.name) {
        // Update the name, no need for uniqueness check
        user.name = updates.name
      }

      if (updates.password) {
        // Password will be hashed automatically by the pre-save middleware
        user.password = updates.password
      }

      // Save the user to trigger the pre-save middleware for password hashing
      await user.save()

      return user
    } catch (error) {
      throw new Error('Error updating user: ' + error.message)
    }
  }

  async deleteUserById(id) {
    try {
      // Find the user by ID
      const userToDelete = await User.findById(id)
      if (!userToDelete) {
        throw new Error('User not found')
      }

      console.log("Found the user to delete: ", userToDelete)

      // Check if the user has any associated students or tutors
      const { students, tutors } = userToDelete
      const allUsersToUpdate = [...students, ...tutors]

      console.log(userToDelete.students)
      console.log(userToDelete.tutors)

      console.log("All users to udpate: ", allUsersToUpdate)

      if (allUsersToUpdate.length > 0) {
        // Update associated users to remove the current user's ID from their arrays
        for (const userId of allUsersToUpdate) {
          const user = await User.findById(userId)

          if (!user) continue // Skip if the associated user is not found

          console.log("User before deletion: ", user)

          // Check and remove the ID from students array
          const studentIndex = user.students.indexOf(id)
          if (studentIndex !== -1) {
            user.students.splice(studentIndex, 1)
          }

          // Check and remove the ID from tutors array
          const tutorIndex = user.tutors.indexOf(id)
          if (tutorIndex !== -1) {
            user.tutors.splice(tutorIndex, 1)
          }

          console.log("User after deletion: ", user)

          // Save the updated user
          await user.save()
        }
      }

      // Delete the user after updating associations
      const deletedUser = await User.findByIdAndDelete(id)
      if (!deletedUser) {
        throw new Error('User could not be deleted')
      }

      console.log("Deleted user now: ", deletedUser)

      return deletedUser
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message)
    }
  }
}
