import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'
import { ownershipMiddleware } from '../../../middleware/ownershipMiddleware.js'
import { Vocabulary } from '../../../models/vocabulary.js'
import { exampleRouter } from './exampleRouter.js'

export const vocabularyRouter = express.Router()

vocabularyRouter.get('/', jwtMiddleware(2), async (req, res) => {
  console.log('Getting all vocabularies...')
  const vocabularyController = container.get(IDENTIFIERS.VocabularyController)
  await vocabularyController.getAllVocabularies(req, res)
})

vocabularyRouter.get(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Vocabulary),
  async (req, res) => {
    console.log('Getting vocabulary by id...')
    const vocabularyController = container.get(IDENTIFIERS.VocabularyController)
    await vocabularyController.getVocabularyById(req, res)
  }
)

vocabularyRouter.post('/', jwtMiddleware(2), async (req, res) => {
  console.log('Creating vocabulary...')
  const vocabularyController = container.get(IDENTIFIERS.VocabularyController)
  await vocabularyController.createVocabulary(req, res)
})

vocabularyRouter.put(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Vocabulary),
  async (req, res) => {
    console.log('Updating vocabulary...')
    const vocabularyController = container.get(IDENTIFIERS.VocabularyController)
    await vocabularyController.updateVocabulary(req, res)
  }
)

vocabularyRouter.delete(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Vocabulary),
  async (req, res) => {
    console.log('Deleting vocabulary...')
    const vocabularyController = container.get(IDENTIFIERS.VocabularyController)
    await vocabularyController.deleteVocabulary(req, res)
  }
)

vocabularyRouter.post('/search', jwtMiddleware(2), async (req, res) => {
  console.log('Searching for vocabulary...')
  const vocabularyController = container.get(IDENTIFIERS.VocabularyController)
  await vocabularyController.searchVocabulary(req, res)
})

vocabularyRouter.use('/:id/examples', exampleRouter)
