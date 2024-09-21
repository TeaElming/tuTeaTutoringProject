import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'
import { ownershipMiddleware } from '../../../middleware/ownershipMiddleware.js'
import { GrammaticalRule } from '../../../models/grammaticalRule.js'
import { exampleRouter } from './exampleRouter.js'

export const grammaticalRuleResource = express.Router()

grammaticalRuleResource.get('/', jwtMiddleware(2), async (req, res) => {
  console.log('Getting all grammatical rules...')
  const grammaticalRuleController = container.get(
    IDENTIFIERS.GrammaticalRuleController
  )
  await grammaticalRuleController.getAllGrammaticalRules(req, res)
})

grammaticalRuleResource.get(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(GrammaticalRule),
  async (req, res) => {
    console.log('Getting grammatical rule by id...')
    const grammaticalRuleController = container.get(
      IDENTIFIERS.GrammaticalRuleController
    )
    await grammaticalRuleController.getGrammaticalRuleById(req, res)
  }
)

grammaticalRuleResource.post('/', jwtMiddleware(2), async (req, res) => {
  console.log('Creating grammatical rule...')
  const grammaticalRuleController = container.get(
    IDENTIFIERS.GrammaticalRuleController
  )
  await grammaticalRuleController.createGrammaticalRule(req, res)
})

grammaticalRuleResource.put(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(GrammaticalRule),
  async (req, res) => {
    console.log('Updating grammatical rule...')
    const grammaticalRuleController = container.get(
      IDENTIFIERS.GrammaticalRuleController
    )
    await grammaticalRuleController.updateRule(req, res)
  }
)

grammaticalRuleResource.delete(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(GrammaticalRule),
  async (req, res) => {
    console.log('Deleting grammatical rule...')
    const grammaticalRuleController = container.get(
      IDENTIFIERS.GrammaticalRuleController
    )
    await grammaticalRuleController.deleteRule(req, res)
  }
)

grammaticalRuleResource.post('/search', jwtMiddleware(2), async (req, res) => {
  console.log('Searching for grammatical rule...')
  const grammaticalRuleController = container.get(
    IDENTIFIERS.GrammaticalRuleController
  )
  await grammaticalRuleController.searchGrammaticalRule(req, res)
})

grammaticalRuleResource.use('/:id/examples', exampleRouter)
