const IDENTIFIERS = {
  // Services
  ActivityService: Symbol.for('ActivityService'),
  GoalService: Symbol.for('GoalService'),
  TimelogService: Symbol.for('TimelogService'),
  // Controllers
  ActivityController: Symbol.for('ActivityController'),
  GoalController: Symbol.for('GoalController'),
  TimelogController: Symbol.for('TimelogController'),

  // Webhooks
  // Services
  GoalWebhookService: Symbol.for('GoalWebhookService'),
  TimelogWebhookService: Symbol.for('TimelogWebhookService'),

  // Controllers
  GoalWebhookController: Symbol.for('GoalWebhookController'),
  TimelogWebhookController: Symbol.for('TimelogWebhookController'),
}

export default IDENTIFIERS
