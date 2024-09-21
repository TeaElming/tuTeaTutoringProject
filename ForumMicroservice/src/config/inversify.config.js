import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'
import IDENTIFIERS from './identifiers.js'

// Services
import { PostService } from '../services/postService.js'
import { WebhookService } from '../services/webhookService.js'

// Controllers
import { PostController } from '../controllers/postController.js'
import { WebhookController } from '../controllers/webhookController.js'

// Decorate services with injectable
decorate(injectable(), PostService)
decorate(injectable(), WebhookService)

// Decorate controllers with injectable
decorate(injectable(), PostController)
decorate(injectable(), WebhookController)

// Inject services into controllers
decorate(inject(IDENTIFIERS.WebhookService), PostService, 0)
decorate(inject(IDENTIFIERS.PostService), PostController, 0)
decorate(inject(IDENTIFIERS.WebhookService), WebhookController, 0)

const container = new Container()

// Bind services to container in singletonScope
container.bind(IDENTIFIERS.PostService).to(PostService).inSingletonScope()
container.bind(IDENTIFIERS.WebhookService).to(WebhookService).inSingletonScope()

// Bind controllers to container in singletonScope
container.bind(IDENTIFIERS.PostController).to(PostController).inSingletonScope()
container
  .bind(IDENTIFIERS.WebhookController)
  .to(WebhookController)
  .inSingletonScope()

export default container
