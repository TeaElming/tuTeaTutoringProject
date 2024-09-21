export class GoalWebhookController {
  constructor(goalWebhookService) {
    this.goalWebhookService = goalWebhookService
  }

  async createGoalWebhook(req, res) {
    try {
      const { eventType, goal } = req.body
      await this.goalWebhookService.createGoalWebhook(eventType, goal)
      res.status(201).json({ message: 'Webhook created successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async removeGoalWebhook(req, res) {
    try {
      const { goalId } = req.params
      await this.goalWebhookService.removeGoalWebhook(goalId)
      res.status(200).json({ message: 'Webhook removed successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getGoalWebhooks(req, res) {
    try {
      const webhooks = await this.goalWebhookService.getGoalWebhooks()
      res.status(200).json(webhooks)
    } catch (error) {
      res.status500().json({ error: error.message })
    }
  }
}
