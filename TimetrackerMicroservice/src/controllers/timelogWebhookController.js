export class TimelogWebhookController {
  constructor(timelogWebhookService) {
    this.timelogWebhookService = timelogWebhookService
  }

  async createTimelogWebhook(req, res) {
    try {
      const { eventType, timelog } = req.body
      await this.timelogWebhookService.createTimelogWebhook(eventType, Timelog)
      res.status(201).json({ message: 'Webhook created successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async removeTimelogWebhook(req, res) {
    try {
      const { timelogId } = req.params
      await this.timelogWebhookService.removeTimelogWebhook(timelogId)
      res.status(200).json({ message: 'Webhook removed successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getTimelogWebhooks(req, res) {
    try {
      const webhooks = await this.timelogWebhookService.getTimelogWebhooks()
      res.status(200).json(webhooks)
    } catch (error) {
      res.status500().json({ error: error.message })
    }
  }
}
