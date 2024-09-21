import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'
import IDENTIFIERS from './identifiers.js'

// Services
import { AuthService } from '../services/authService.js'
import { UserService } from '../services/userService.js'
import { RelationshipService } from '../services/relationshipService.js'

// Controllers
import { AuthController } from '../controllers/authController.js'
import { UserController } from '../controllers/userController.js'
import { RelationshipController } from '../controllers/relationshipController.js'


// Decorate services with injectable
decorate(injectable(), AuthService)
decorate(injectable(), UserService)
decorate(injectable(), RelationshipService)

// Decorate controllers with injectable
decorate(injectable(), AuthController)
decorate(injectable(), UserController)
decorate(injectable(), RelationshipController)


// Inject services into controllers
decorate(inject(IDENTIFIERS.AuthService), AuthController, 0)
decorate(inject(IDENTIFIERS.UserService), UserController, 0)
decorate(inject(IDENTIFIERS.RelationshipService), RelationshipController, 0)



const container = new Container()

// Bind services to container
container.bind(IDENTIFIERS.AuthService).to(AuthService).inSingletonScope()
container.bind(IDENTIFIERS.UserService).to(UserService).inSingletonScope()
container.bind(IDENTIFIERS.RelationshipService).to(RelationshipService).inSingletonScope()
// Bind controllers to container
container.bind(IDENTIFIERS.AuthController).to(AuthController).inSingletonScope()
container.bind(IDENTIFIERS.UserController).to(UserController).inSingletonScope()
container.bind(IDENTIFIERS.RelationshipController).to(RelationshipController).inSingletonScope()

export default container

