import { Sentence } from '../models/sentence.js'
import { checkOwnershipOrTutor } from '../helpers/authorisationHelper.js'
import { Example } from '../models/example.js'

export class SentenceService {
  async createSentence(reqUser, sentence, sentenceData, studentIds = []) {
    try {
      const ownerIds = []

      // Handle tutors creating resources for their students
      if (reqUser.permissionLevel === 1) {
        for (const studentId of studentIds) {
          if (reqUser.students.includes(studentId)) {
            ownerIds.push(studentId)
          } else {
            throw new Error(
              `Unauthorized attempt to create resource for student ID: ${studentId}`
            )
          }
        }

        // If no student IDs are provided, create the resource for the tutor
        if (ownerIds.length === 0) {
          ownerIds.push(reqUser.id)
        }
      } else {
        // For all other users, create the resource for themselves
        ownerIds.push(reqUser.id)
      }

      // Create a resource for each owner
      const createdSentences = []
      const skippedOwners = []

      for (const ownerId of ownerIds) {
        const existingSentence = await Sentence.findOne({
          sentence: sentence,
          owner: ownerId,
        })

        if (existingSentence) {
          skippedOwners.push(ownerId)
          continue // Skip this owner and move to the next
        }

        const sentenceInformation = {
          owner: ownerId,
          sentence: sentence,
          ...sentenceData,
        }
        const newSentence = new Sentence(sentenceInformation)
        await newSentence.save()
        createdSentences.push(newSentence)
      }

      if (skippedOwners.length > 0) {
        console.log(
          `Skipped creating sentence for owner IDs: ${skippedOwners.join(', ')}`
        )
      }

      return createdSentences
    } catch (error) {
      throw new Error(`Error creating sentence: ${error.message}`)
    }
  }

  async getAllSentences(reqUser, studentIds = []) {
    try {
      let query = {}

      if (reqUser.permissionLevel === 1) {
        const validStudentIds = studentIds.filter((studentId) =>
          reqUser.students.includes(studentId)
        )

        // Fetch only the tutor's resources if studentIds is empty
        const ownerIds =
          validStudentIds.length > 0
            ? [reqUser.id, ...validStudentIds]
            : [reqUser.id]

        query = { owner: { $in: ownerIds } }
      } else if (reqUser.permissionLevel === 0) {
        query = {} // Admin has access to everything
      } else {
        query = { owner: reqUser.id } // Regular users can only fetch their own resources
      }

      const sentences = await Sentence.find(query)
      return sentences
    } catch (error) {
      throw new Error(`Error fetching sentences: ${error.message}`)
    }
  }

  async getSentenceById(reqUser, sentenceId) {
    try {
      const sentence = await Sentence.findById(sentenceId)

      if (!sentence) {
        throw new Error('Sentence not found')
      }

      if (!checkOwnershipOrTutor(reqUser, sentence.owner)) {
        throw new Error('You are not authorized to view this sentence')
      }

      return sentence
    } catch (error) {
      throw new Error(`Error fetching sentence: ${error.message}`)
    }
  }

  async updateSentence(reqUser, sentenceId, sentenceData) {
    try {
      const sentence = await Sentence.findById(sentenceId)

      if (!sentence) {
        throw new Error('Sentence not found')
      }

      if (!checkOwnershipOrTutor(reqUser, sentence.owner)) {
        throw new Error('You are not authorized to update this sentence')
      }

      const updatedSentence = await Sentence.findByIdAndUpdate(
        sentenceId,
        sentenceData,
        {
          new: true,
        }
      )
      return updatedSentence
    } catch (error) {
      throw new Error(`Error updating sentence: ${error.message}`)
    }
  }

  async deleteSentence(reqUser, sentenceId) {
    try {
      const sentence = await Sentence.findById(sentenceId)

      if (!sentence) {
        throw new Error('Sentence not found')
      }

      if (!checkOwnershipOrTutor(reqUser, sentence.owner)) {
        throw new Error('You are not authorized to delete this sentence')
      }

      for (const exampleId of sentence.examples) {
        Example.findByIdAndDelete(exampleId)
      }

      await Sentence.findByIdAndDelete(sentenceId)
      return { message: 'Sentence deleted successfully' }
    } catch (error) {
      throw new Error(`Error deleting sentence: ${error.message}`)
    }
  }

  async searchSentence(reqUser, query) {
    try {
      let searchQuery = { owner: reqUser.id }

      if (reqUser.permissionLevel === 1) {
        searchQuery = { owner: { $in: [reqUser.id, ...reqUser.students] } }
      } else if (reqUser.permissionLevel === 0) {
        searchQuery = {} // Admin has access to everything
      }

      searchQuery.$or = [
        { sentence: { $regex: query, $options: 'i' } },
        { semanticTranslation: { $regex: query, $options: 'i' } },
        { directTranslation: { $regex: query, $options: 'i' } },
      ]

      const sentences = await Sentence.find(searchQuery)
      return sentences
    } catch (error) {
      throw new Error(`Error searching sentences: ${error.message}`)
    }
  }
}
