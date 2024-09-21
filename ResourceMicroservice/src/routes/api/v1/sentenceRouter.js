import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'
import { ownershipMiddleware } from '../../../middleware/ownershipMiddleware.js'
import { Sentence } from '../../../models/sentence.js'
import { exampleRouter } from './exampleRouter.js'

export const sentenceRouter = express.Router()

sentenceRouter.get('/', jwtMiddleware(2), async (req, res) => {
  console.log('Getting all sentences...')
  const sentenceController = container.get(IDENTIFIERS.SentenceController)
  await sentenceController.getAllSentences(req, res)
})

sentenceRouter.get(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Sentence),
  async (req, res) => {
    console.log('Getting sentence by id...')
    const sentenceController = container.get(IDENTIFIERS.SentenceController)
    await sentenceController.getSentenceById(req, res)
  }
)

sentenceRouter.post('/', jwtMiddleware(2), async (req, res) => {
  console.log('Creating sentence...')
  const sentenceController = container.get(IDENTIFIERS.SentenceController)
  await sentenceController.createSentence(req, res)
})

sentenceRouter.put(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Sentence),
  async (req, res) => {
    console.log('Updating sentence...')
    const sentenceController = container.get(IDENTIFIERS.SentenceController)
    await sentenceController.updateSentence(req, res)
  }
)

sentenceRouter.delete(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Sentence),
  async (req, res) => {
    console.log('Deleting sentence...')
    const sentenceController = container.get(IDENTIFIERS.SentenceController)
    await sentenceController.deleteSentence(req, res)
  }
)

sentenceRouter.post('/search', jwtMiddleware(2), async (req, res) => {
  console.log('Searching for sentence...')
  const sentenceController = container.get(IDENTIFIERS.SentenceController)
  await sentenceController.searchSentence(req, res)
})

sentenceRouter.use('/:id/examples', exampleRouter)
