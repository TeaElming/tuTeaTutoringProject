import { Vocabulary } from '../models/vocabulary.js'
import { checkOwnershipOrTutor } from '../helpers/authorisationHelper.js'
import { Example } from '../models/example.js'

export class VocabularyService {
  async createVocabulary(reqUser, word, vocabularyData, studentIds = []) {
    try {
      // Normalize the word
      const normalizedWord = word.trim().toLowerCase()

      const ownerIds = []

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

        if (ownerIds.length === 0) {
          ownerIds.push(reqUser.id)
        }
      } else {
        ownerIds.push(reqUser.id)
      }

      const createdVocabularies = []
      const skippedOwners = []

      for (const ownerId of ownerIds) {
        // Check if the normalized word already exists for this owner
        const existingVocabulary = await Vocabulary.findOne({
          word: normalizedWord,
          owner: ownerId,
        })

        if (existingVocabulary) {
          skippedOwners.push({ ownerId, word: normalizedWord })
          continue // Skip this owner and move to the next
        }

        const vocabularyInformation = {
          owner: ownerId,
          word: normalizedWord, // Use the normalized word
          ...vocabularyData,
        }

        const newVocabulary = new Vocabulary(vocabularyInformation)
        await newVocabulary.save()
        createdVocabularies.push(newVocabulary)
      }

      if (skippedOwners.length > 0) {
        console.log(
          `Skipped creating vocabulary for the following combinations: ${JSON.stringify(
            skippedOwners
          )}`
        )
      }

      console.log('New vocab added: ', createdVocabularies)

      return createdVocabularies
    } catch (error) {
      throw new Error(`Error creating vocabulary: ${error.message}`)
    }
  }

  async getAllVocabularies(reqUser, studentIds = []) {
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

      const vocabularies = await Vocabulary.find(query)
      return vocabularies
    } catch (error) {
      throw new Error(`Error fetching vocabularies: ${error.message}`)
    }
  }

  async getVocabularyById(reqUser, vocabularyId) {
    try {
      const vocabulary = await Vocabulary.findById(vocabularyId)

      if (!vocabulary) {
        throw new Error('Vocabulary not found')
      }

      if (!checkOwnershipOrTutor(reqUser, vocabulary.owner)) {
        throw new Error('You are not authorized to view this vocabulary')
      }

      return vocabulary
    } catch (error) {
      throw new Error(`Error fetching vocabulary: ${error.message}`)
    }
  }

  async updateVocabulary(reqUser, vocabularyId, vocabularyData) {
    try {
      const vocabulary = await Vocabulary.findById(vocabularyId)

      if (!vocabulary) {
        throw new Error('Vocabulary not found')
      }

      if (!checkOwnershipOrTutor(reqUser, vocabulary.owner)) {
        throw new Error('You are not authorized to update this vocabulary')
      }

      const updatedVocabulary = await Vocabulary.findByIdAndUpdate(
        vocabularyId,
        vocabularyData,
        { new: true }
      )
      return updatedVocabulary
    } catch (error) {
      throw new Error(`Error updating vocabulary: ${error.message}`)
    }
  }

  async deleteVocabulary(reqUser, vocabularyId) {
    try {
      const vocabulary = await Vocabulary.findById(vocabularyId)

      if (!vocabulary) {
        throw new Error('Vocabulary not found')
      }

      if (!checkOwnershipOrTutor(reqUser, vocabulary.owner)) {
        throw new Error('You are not authorized to delete this vocabulary')
      }

      for (const exampleId of vocabulary.examples) {
        Example.findByIdAndDelete(exampleId)
      }

      await Vocabulary.findByIdAndDelete(vocabularyId)
      return { message: 'Vocabulary deleted successfully' }
    } catch (error) {
      throw new Error(`Error deleting vocabulary: ${error.message}`)
    }
  }

  async searchVocabulary(reqUser, query) {
    try {
      let searchQuery = { owner: reqUser.id }

      if (reqUser.permissionLevel === 1) {
        searchQuery = { owner: { $in: [reqUser.id, ...reqUser.students] } }
      } else if (reqUser.permissionLevel === 0) {
        searchQuery = {} // Admin has access to everything
      }

      searchQuery.$or = [
        { word: { $regex: query, $options: 'i' } },
        { translation: { $regex: query, $options: 'i' } },
        { wordGroup: { $regex: query, $options: 'i' } },
      ]

      const vocabularies = await Vocabulary.find(searchQuery)
      return vocabularies
    } catch (error) {
      throw new Error(`Error searching vocabulary: ${error.message}`)
    }
  }
}
