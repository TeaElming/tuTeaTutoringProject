export class ExpressionController {
  constructor(expressionService) {
    this.expressionService = expressionService
  }

  async createExpression(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Get student IDs from the request body
      const expression = await this.expressionService.createExpression(
        req.user,
        req.body.expression,
        req.body,
        studentIds
      )
      res.status(201).json(expression)
    } catch (error) {
      res
        .status(error.message.includes('Unauthorized') ? 403 : 400)
        .json({ error: error.message })
    }
  }

  async getAllExpressions(req, res) {
    try {
      const studentIds = req.body.studentIds || []
      const expressions = await this.expressionService.getAllExpressions(
        req.user,
        studentIds
      )
      res.status(200).json(expressions)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async getExpressionById(req, res) {
    try {
      const expression = await this.expressionService.getExpressionById(
        req.user, // Pass req.user for ownership check
        req.params.id
      )
      res.status(200).json(expression)
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ error: error.message })
    }
  }

  async updateExpression(req, res) {
    try {
      const expression = await this.expressionService.updateExpression(
        req.user,
        req.params.id,
        req.body
      )
      res.status(200).json(expression)
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ error: error.message })
    }
  }

  async deleteExpression(req, res) {
    try {
      await this.expressionService.deleteExpression(
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
        .json({ error: error.message })
    }
  }

  async searchExpression(req, res) {
    try {
      const query = req.body.query
      const expressions = await this.expressionService.searchExpression(
        req.user,
        query
      )
      res.status(200).json(expressions)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
