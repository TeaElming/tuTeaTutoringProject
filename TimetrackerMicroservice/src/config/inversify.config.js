import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'
import IDENTIFIERS from './identifiers.js'

// Services
import { ActivityService } from '../services/activityService.js'
import { GoalService } from '../services/goalService.js'
import { TimelogService } from '../services/timelogService.js'
// Webhook Services
import { GoalWebhookService } from '../services/goalWebhookService.js'
import { TimelogWebhookService } from '../services/timelogWebhookService.js'

// Controllers
import { ActivityController } from '../controllers/activityController.js'
import { GoalController } from '../controllers/goalController.js'
import { TimelogController } from '../controllers/timelogController.js'
// Webhook Controllers
import { GoalWebhookController } from '../controllers/goalWebhookController.js'
import { TimelogWebhookController } from '../controllers/timelogWebhookController.js'

// Services
decorate(injectable(), ActivityService)
decorate(injectable(), GoalService)
decorate(injectable(), TimelogService)
// Webhooks
decorate(injectable(), GoalWebhookService)
decorate(injectable(), TimelogWebhookService)

// Controlelrs
decorate(injectable(), ActivityController)
decorate(injectable(), GoalController)
decorate(injectable(), TimelogController)
// Webhooks
decorate(injectable(), GoalWebhookController)
decorate(injectable(), TimelogWebhookController)

// Services into controlelrs
decorate(inject(IDENTIFIERS.ActivityService), ActivityController, 0)
decorate(inject(IDENTIFIERS.GoalService), GoalController, 0)
decorate(inject(IDENTIFIERS.TimelogService), TimelogController, 0)

// Need to inject Webhooks into services, and WH Services into WH controllers
decorate(inject(IDENTIFIERS.GoalWebhookService), GoalService, 0)
decorate(inject(IDENTIFIERS.GoalWebhookService), GoalWebhookController, 0)

decorate(inject(IDENTIFIERS.TimelogWebhookService), TimelogService, 0)
decorate(inject(IDENTIFIERS.TimelogWebhookService), TimelogWebhookController, 0)

const container = new Container()

// Services
container.bind(IDENTIFIERS.ActivityService).to(ActivityService).inSingletonScope()
container.bind(IDENTIFIERS.GoalService).to(GoalService).inSingletonScope()
container.bind(IDENTIFIERS.TimelogService).to(TimelogService).inSingletonScope()
//Webhooks
container.bind(IDENTIFIERS.GoalWebhookService).to(GoalWebhookService).inSingletonScope()
container.bind(IDENTIFIERS.TimelogWebhookService).to(TimelogWebhookService).inSingletonScope()

// Controllers
container.bind(IDENTIFIERS.ActivityController).to(ActivityController).inSingletonScope()
container.bind(IDENTIFIERS.GoalController).to(GoalController).inSingletonScope()
container.bind(IDENTIFIERS.TimelogController).to(TimelogController).inSingletonScope()
// Webhook controllers
container.bind(IDENTIFIERS.GoalWebhookController).to(GoalWebhookController).inSingletonScope()
container.bind(IDENTIFIERS.TimelogWebhookController).to(TimelogWebhookController).inSingletonScope()

export default container
