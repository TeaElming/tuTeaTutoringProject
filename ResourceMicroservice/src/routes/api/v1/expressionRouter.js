import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'
import { exampleRouter } from './exampleRouter.js'
import { ownershipMiddleware } from '../../../middleware/ownershipMiddleware.js'
import { Expression } from '../../../models/expression.js' // To use with middleware

export const expressionRouter = express.Router()

expressionRouter.get('/', jwtMiddleware(2), async (req, res) => {
  console.log('Getting all expressions for this resource...')
  const expressionController = container.get(
    IDENTIFIERS.ExpressionController
  )
  await expressionController.getAllExpressions(req, res)
})

expressionRouter.get(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Expression),
  async (req, res) => {
    console.log('Getting expression by id...')
    const expressionController = container.get(
      IDENTIFIERS.ExpressionController
    )
    await expressionController.getExpressionById(req, res)
  }
)

expressionRouter.post('/', jwtMiddleware(2), async (req, res) => {
  console.log('Creating expression...')
  const expressionController = container.get(
    IDENTIFIERS.ExpressionController
  )
  await expressionController.createExpression(req, res)
})

expressionRouter.put(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Expression),
  async (req, res) => {
    console.log('Updating expression...')
    const expressionController = container.get(
      IDENTIFIERS.ExpressionController
    )
    await expressionController.updateExpression(req, res)
  }
)

expressionRouter.delete(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Expression),
  async (req, res) => {
    console.log('Deleting expression...')
    const expressionController = container.get(
      IDENTIFIERS.ExpressionController
    )
    await expressionController.deleteExpression(req, res)
  }
)

expressionRouter.post(
  '/search',
  jwtMiddleware(2),
  ownershipMiddleware(Expression),
  async (req, res) => {
    console.log('Searching for expression...')
    const expressionController = container.get(
      IDENTIFIERS.ExpressionController
    )
    await expressionController.searchExpression(req, res)
  }
)

expressionRouter.use('/:id/examples', exampleRouter)
