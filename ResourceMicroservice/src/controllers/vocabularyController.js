export class VocabularyController {
  constructor(vocabularyService) {
    this.vocabularyService = vocabularyService
  }

  async createVocabulary(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Get student IDs from request body
      const newVocabularies = await this.vocabularyService.createVocabulary(
        req.user,
        req.body.word,
        req.body,
        studentIds
      )

      res.status(201).json(newVocabularies)
    } catch (error) {
      res
        .status(error.message.includes('Unauthorized') ? 403 : 400)
        .json({ message: error.message })
    }
  }

  async getAllVocabularies(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Extract studentIds from request body
      const vocabularies = await this.vocabularyService.getAllVocabularies(
        req.user, // Pass req.user for ownership check
        studentIds // Pass studentIds to the service method
      )
      res.status(200).json(vocabularies)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async getVocabularyById(req, res) {
    try {
      const vocabulary = await this.vocabularyService.getVocabularyById(
        req.user, // Pass req.user for ownership check
        req.params.id
      )
      res.status(200).json(vocabulary)
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ message: error.message })
    }
  }

  async updateVocabulary(req, res) {
    try {
      const updatedVocabulary = await this.vocabularyService.updateVocabulary(
        req.user, // Pass req.user for ownership check
        req.params.id,
        req.body
      )
      res.status(200).json(updatedVocabulary)
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ message: error.message })
    }
  }

  async deleteVocabulary(req, res) {
    try {
      await this.vocabularyService.deleteVocabulary(
        req.user, // Pass req.user for ownership check
        req.params.id
      )
      res.status(204).end()
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ message: error.message })
    }
  }

  async searchVocabulary(req, res) {
    try {
      const query = req.body.query
      const vocabularies = await this.vocabularyService.searchVocabulary(
        req.user,
        query
      )
      res.status(200).json(vocabularies)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
