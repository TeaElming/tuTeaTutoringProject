import { GoalWebhook } from '../models/goalWebhook.js'
import { broadcast } from '../websocket-server.js'

export class GoalWebhookService {
  async createGoalWebhook(eventType, goal) {
    const goalWebhook = new GoalWebhook({
      eventType,
      goalId: goal._id,
      goalData: goal,
    })
    await goalWebhook.save()

    broadcast({ eventType, goal })

    console.log('WebhookService: Webhook broadcasted of the type:', {
      eventType,
    })
  }

  async removeGoalWebhook(goalId) {
    const result = await GoalWebhook.deleteMany({ goalId })
    console.log('WebhookService: Webhooks removed:', result)
  }

  async getGoalWebhooks() {
    const webhooks = await GoalWebhook.find({})
    console.log('WebhookService: Fetched webhooks:', webhooks)
    return webhooks
  }
}
