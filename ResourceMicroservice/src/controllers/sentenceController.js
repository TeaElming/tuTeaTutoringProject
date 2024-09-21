export class SentenceController {
  constructor(sentenceService) {
    this.sentenceService = sentenceService
  }

  async createSentence(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Get student IDs from request body
      const newSentences = await this.sentenceService.createSentence(
        req.user,
        req.body.sentence,
        req.body,
        studentIds
      )

      res.status(201).json(newSentences)
    } catch (error) {
      res
        .status(error.message.includes('Unauthorized') ? 403 : 400)
        .json({ message: error.message })
    }
  }

  async getAllSentences(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Extract studentIds from request body
      const sentences = await this.sentenceService.getAllSentences(
        req.user, // Pass req.user for ownership check
        studentIds // Pass studentIds to the service method
      )
      res.status(200).json(sentences)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async getSentenceById(req, res) {
    try {
      const sentence = await this.sentenceService.getSentenceById(
        req.user, // Pass req.user for ownership check
        req.params.id
      )
      res.status(200).json(sentence)
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

  async updateSentence(req, res) {
    try {
      const updatedSentence = await this.sentenceService.updateSentence(
        req.user, // Pass req.user for ownership check
        req.params.id,
        req.body
      )
      res.status(200).json(updatedSentence)
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

  async deleteSentence(req, res) {
    try {
      await this.sentenceService.deleteSentence(
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

  async searchSentence(req, res) {
    try {
      const query = req.body.query
      const sentences = await this.sentenceService.searchSentence(
        req.user,
        query
      )
      res.status(200).json(sentences)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
