import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'

export const goalRouter = express.Router()

// Create a new goal
goalRouter.post('/', jwtMiddleware(2), async (req, res) => {
  const goalController = container.get(IDENTIFIERS.GoalController)
  await goalController.createGoal(req, res)
})

// Get all goals for a user
goalRouter.get('/:userId', jwtMiddleware(2), async (req, res) => {
  const goalController = container.get(IDENTIFIERS.GoalController)
  await goalController.getGoals(req, res)
})

// Update a goal
goalRouter.put('/:id', jwtMiddleware(2), async (req, res) => {
  const goalController = container.get(IDENTIFIERS.GoalController)
  await goalController.updateGoal(req, res)
})

// Delete a goal
goalRouter.delete('/:id', jwtMiddleware(2), async (req, res) => {
  const goalController = container.get(IDENTIFIERS.GoalController)
  await goalController.deleteGoal(req, res)
})

// Calculate progress for a goal
goalRouter.get('/:id/progress', jwtMiddleware(2), async (req, res) => {
  const goalController = container.get(IDENTIFIERS.GoalController)
  await goalController.calculateProgress(req, res)
})

// Specific goal by ID
goalRouter.get('/specific/:id', jwtMiddleware(2), async (req, res) => {
  const goalController = container.get(IDENTIFIERS.GoalController)
  await goalController.getGoalById(req, res)
})
