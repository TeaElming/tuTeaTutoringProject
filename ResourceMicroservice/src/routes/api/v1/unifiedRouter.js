import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'

export const unifiedResourceRouter = express.Router()

unifiedResourceRouter.get('/', jwtMiddleware(2), async (req, res) => {
  console.log('Getting all resources...')
  const unifiedResourceController = container.get(
    IDENTIFIERS.UnifiedResourceController
  )
  await unifiedResourceController.getAllResources(req, res)
})

unifiedResourceRouter.get('/sorted', jwtMiddleware(2), async (req, res) => {
  console.log('Getting sorted resources...')
  const unifiedResourceController = container.get(
    IDENTIFIERS.UnifiedResourceController
  )
  await unifiedResourceController.getSortedResources(req, res)
})
