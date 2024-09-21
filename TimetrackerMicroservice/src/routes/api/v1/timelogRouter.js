import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'

export const timelogRouter = express.Router()

// Log time for an activity
timelogRouter.post('/', jwtMiddleware(2), async (req, res) => {
  const timeLogController = container.get(IDENTIFIERS.TimelogController)
  await timeLogController.logTime(req, res)
})

// Get all time logs for a user
timelogRouter.get('/', jwtMiddleware(2), async (req, res) => {
  const timeLogController = container.get(IDENTIFIERS.TimelogController)
  await timeLogController.getTimeLogs(req, res)
})

// Aggregate time logs by period
timelogRouter.post('/aggregate', jwtMiddleware(2), async (req, res) => {
  const timeLogController = container.get(IDENTIFIERS.TimelogController)
  await timeLogController.getAggregatedTimeLogs(req, res)
})

// Get a single time log by ID
timelogRouter.get('/:logId', jwtMiddleware(2), async (req, res) => {
  const timeLogController = container.get(IDENTIFIERS.TimelogController)
  await timeLogController.getTimeLogById(req, res)
})

// Update a time log by ID
timelogRouter.put('/:logId', jwtMiddleware(2), async (req, res) => {
  const timeLogController = container.get(IDENTIFIERS.TimelogController)
  await timeLogController.updateTimeLogById(req, res)
})

// Delete a time log by ID
timelogRouter.delete('/:logId', jwtMiddleware(2), async (req, res) => {
  const timeLogController = container.get(IDENTIFIERS.TimelogController)
  await timeLogController.deleteTimeLogById(req, res)
})
