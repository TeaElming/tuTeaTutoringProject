export class WebhookController {
  constructor(webhookService) {
    this.webhookService = webhookService
  }

  async createWebhook(req, res) {
    try {
      const { eventType, post } = req.body
      await this.webhookService.createWebhook(eventType, post)
      res.status(201).json({ message: 'Webhook created successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async removeWebhook(req, res) {
    try {
      const { postId } = req.params
      await this.webhookService.removeWebhook(postId)
      res.status(200).json({ message: 'Webhook removed successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getWebhooks(req, res) {
    try {
      const webhooks = await this.webhookService.getWebhooks()
      res.status(200).json(webhooks)
    } catch (error) {
      res.status500().json({ error: error.message })
    }
  }
}
