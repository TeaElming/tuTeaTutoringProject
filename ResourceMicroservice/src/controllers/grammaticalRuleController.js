export class GrammaticalRuleController {
  constructor(grammaticalRuleService) {
    this.grammaticalRuleService = grammaticalRuleService
  }

  async createGrammaticalRule(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Get student IDs from the request body
      const newRules = await this.grammaticalRuleService.createGrammaticalRule(
        req.user,
        req.body.rule,
        req.body.description,
        req.body,
        studentIds
      )

      res.status(201).json(newRules)
    } catch (error) {
      res
        .status(error.message.includes('Unauthorized') ? 403 : 400)
        .json({ message: error.message })
    }
  }

  async getAllGrammaticalRules(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Extract studentIds from request body
      const grammaticalRules =
        await this.grammaticalRuleService.getAllGrammaticalRules(
          req.user, // Pass req.user for ownership check
          studentIds // Pass studentIds to the service method
        )
      res.status(200).json(grammaticalRules)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async getGrammaticalRuleById(req, res) {
    try {
      const grammaticalRule =
        await this.grammaticalRuleService.getGrammaticalRuleById(
          req.user, // Pass req.user for ownership check
          req.params.id
        )
      res.status(200).json(grammaticalRule)
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

  async updateRule(req, res) {
    try {
      const updatedRule = await this.grammaticalRuleService.updateRule(
        req.user, // Pass req.user for ownership check
        req.params.id,
        req.body
      )
      res.status(200).json(updatedRule)
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

  async deleteRule(req, res) {
    try {
      await this.grammaticalRuleService.deleteRule(
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

  async searchGrammaticalRule(req, res) {
    try {
      const query = req.body.query
      const grammarRules =
        await this.grammaticalRuleService.searchGrammaticalRule(req.user, query)
      res.status(200).json(grammarRules)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
