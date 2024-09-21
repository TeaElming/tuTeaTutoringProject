import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'

const relationshipRouter = express.Router()

// GET welcome message
relationshipRouter.get('/', jwtMiddleware(2), (req, res) => {
  res.send(
    'Welcome to the user service for the tuTea Tutoring API!\n You can create new pending relationships, confirm relationships, and delete relationships.'
  )
})

// GET to find all relationships
relationshipRouter.get('/all', jwtMiddleware(2), async (req, res) => {
  const relationshipController = container.get(
    IDENTIFIERS.RelationshipController
  )
  await relationshipController.findAllRelationships(req, res)
})

// GET to find pending relationships
relationshipRouter.get('/pending', jwtMiddleware(2), async (req, res) => {
  const relationshipController = container.get(
    IDENTIFIERS.RelationshipController
  )
  await relationshipController.findPendingRelationships(req, res)
})

// POST to create a pending relationship
relationshipRouter.post('/', jwtMiddleware(2), async (req, res) => {
  const relationshipController = container.get(
    IDENTIFIERS.RelationshipController
  )
  await relationshipController.createPendingRelationship(req, res)
})

// POST to confirm a relationship
relationshipRouter.post('/confirm', jwtMiddleware(2), async (req, res) => {
  const relationshipController = container.get(
    IDENTIFIERS.RelationshipController
  )
  await relationshipController.confirmRelationship(req, res)
})

// GET details of specific relationship
relationshipRouter.get('/:id', jwtMiddleware(2), async (req, res) => {
  const relationshipController = container.get(
    IDENTIFIERS.RelationshipController
  )
  await relationshipController.getRelationshipDetails(req, res)
})

// DELETE to delete a relationship
relationshipRouter.delete('/relationships', jwtMiddleware(2), async (req, res) => {
  const relationshipController = container.get(
    IDENTIFIERS.RelationshipController
  )
  await relationshipController.deleteRelationship(req, res)
})

// DELETE to decline a pending relationship
relationshipRouter.delete('/decline', jwtMiddleware(2), async (req, res) => {
  const relationshipController = container.get(
    IDENTIFIERS.RelationshipController
  )
  await relationshipController.declinePendingRelationship(req, res)
})

export default relationshipRouter
