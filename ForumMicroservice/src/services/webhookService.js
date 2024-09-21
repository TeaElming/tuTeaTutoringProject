import { Webhook } from '../models/webhook.js'
import { broadcast } from '../websocket-server.js'

export class WebhookService {
  async createWebhook(eventType, post) {
    console.log('WebhookService: Creating webhook:', eventType, post._id)
    const webhook = new Webhook({
      eventType,
      postId: post._id,
      postData: post,
    })
    await webhook.save()
    console.log('WebhookService: Webhook saved')
    broadcast({ eventType, post }) // Broadcast the webhook event
    console.log('WebhookService: Webhook broadcasted of the type:', { eventType })
  }

  async removeWebhook(postId) {
    console.log('WebhookService: Removing webhooks for postId:', postId)
    const result = await Webhook.deleteMany({ postId })
    console.log('WebhookService: Webhooks removed:', result)
  }

  async getWebhooks() {
    console.log('WebhookService: Fetching webhooks')
    const webhooks = await Webhook.find({})
    console.log('WebhookService: Fetched webhooks:', webhooks)
    return webhooks
  }
}
