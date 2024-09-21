import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'

export const activityRouter = express.Router()

// Get all activities
activityRouter.get('/', jwtMiddleware(2), async (req, res) => {
  const activityController = container.get(IDENTIFIERS.ActivityController)
  await activityController.getAllActivities(req, res)
})

// Get a specific activity by ID
activityRouter.get('/:id', jwtMiddleware(2), async (req, res) => {
  const activityController = container.get(IDENTIFIERS.ActivityController)
  await activityController.getActivityById(req, res)
})
