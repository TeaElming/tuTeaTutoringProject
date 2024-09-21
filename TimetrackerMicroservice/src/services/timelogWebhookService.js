import { TimelogWebhook } from '../models/timelogWebhook.js'
import { broadcast } from '../websocket-server.js'

export class TimelogWebhookService {
  async createTimelogWebhook(eventType, timelog) {
    const timelogWebhook = new TimelogWebhook({
      eventType,
      timelogId: timelog.id,
      timelogData: timelog,
    })
    await timelogWebhook.save()

    broadcast({ eventType, timelog })

    console.log('WebhookService: Webhook broadcasted of the type:', {
      eventType,
    })
  }

  async removeTimelogWebhook(timelogId) {
    const result = await TimelogWebhook.deleteMany({ timelogId })
    console.log('WebhookService: Webhooks removed:', result)
  }

  async getTimelogWebhooks() {
    const webhooks = await TimelogWebhook.find({})
    console.log('WebhookService: Fetched webhooks:', webhooks)
    return webhooks
  }
}
