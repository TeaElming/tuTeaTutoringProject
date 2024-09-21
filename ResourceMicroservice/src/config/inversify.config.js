import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'
import IDENTIFIERS from './identifiers.js'

// Import Services
import { ExampleService } from '../services/exampleService.js'
import { ExpressionService } from '../services/expressionService.js'
import { GenericResourceService } from '../services/genericResourceService.js'
import { GrammaticalRuleService } from '../services/grammaticalRuleService.js'
import { SentenceService } from '../services/sentenceService.js'
import { VocabularyService } from '../services/vocabularyService.js'
import { UnifiedResourceService } from '../services/unifiedResourceService.js'

// Import Controllers
import { ExampleController } from '../controllers/exampleController.js'
import { ExpressionController } from '../controllers/expressionController.js'
import { GenericResourceController } from '../controllers/genericResourceController.js'
import { GrammaticalRuleController } from '../controllers/grammaticalRuleController.js'
import { SentenceController } from '../controllers/sentenceController.js'
import { VocabularyController } from '../controllers/vocabularyController.js'
import { UnifiedResourceController } from '../controllers/unifiedResourceController.js'

decorate(injectable(), ExampleService)
decorate(injectable(), ExpressionService)
decorate(injectable(), GenericResourceService)
decorate(injectable(), GrammaticalRuleService)
decorate(injectable(), SentenceService)
decorate(injectable(), VocabularyService)
decorate(injectable(), UnifiedResourceService)

decorate(injectable(), ExampleController)
decorate(injectable(), ExpressionController)
decorate(injectable(), GenericResourceController)
decorate(injectable(), GrammaticalRuleController)
decorate(injectable(), SentenceController)
decorate(injectable(), VocabularyController)
decorate(injectable(), UnifiedResourceController)

// Inejct services into controllers
decorate(inject(IDENTIFIERS.ExampleService), ExampleController, 0)
decorate(inject(IDENTIFIERS.ExpressionService), ExpressionController, 0)
decorate(
  inject(IDENTIFIERS.GenericResourceService),
  GenericResourceController,
  0
)
decorate(inject(IDENTIFIERS.GrammaticalRuleService), GrammaticalRuleController, 0)
decorate(inject(IDENTIFIERS.SentenceService), SentenceController, 0)
decorate(inject(IDENTIFIERS.VocabularyService), VocabularyController, 0)
decorate(inject(IDENTIFIERS.UnifiedService), UnifiedResourceController, 0)

const container = new Container()

// Bind services to container
container.bind(IDENTIFIERS.ExampleService).to(ExampleService).inSingletonScope()
container
  .bind(IDENTIFIERS.ExpressionService)
  .to(ExpressionService)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.GenericResourceService)
  .to(GenericResourceService)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.GrammaticalRuleService)
  .to(GrammaticalRuleService)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.SentenceService)
  .to(SentenceService)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.VocabularyService)
  .to(VocabularyService)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.UnifiedService)
  .to(UnifiedResourceService)
  .inSingletonScope()

// Bind controllers to container
container
  .bind(IDENTIFIERS.ExampleController)
  .to(ExampleController)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.ExpressionController)
  .to(ExpressionController)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.GenericResourceController)
  .to(GenericResourceController)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.GrammaticalRuleController)
  .to(GrammaticalRuleController)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.SentenceController)
  .to(SentenceController)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.VocabularyController)
  .to(VocabularyController)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.UnifiedResourceController)
  .to(UnifiedResourceController)
  .inSingletonScope()

export default container
