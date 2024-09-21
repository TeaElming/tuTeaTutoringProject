import express from 'express'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'
import { ownershipMiddleware } from '../../../middleware/ownershipMiddleware.js'
import { Example } from '../../../models/example.js' // To use with middleware

export const exampleRouter = express.Router()

// Middleware to extract resourceId and resourceType from the URL
exampleRouter.use((req, res, next) => {
  // Extract the resource ID and resource type from the URL path
  const urlSegments = req.originalUrl.split('/')

  // Resource ID is just before 'examples' and resource type before the resource ID
  const exampleIndex = urlSegments.indexOf('examples')
  if (exampleIndex > 1) {
    req.resourceId = urlSegments[exampleIndex - 1] // Resource ID
    req.resourceType = urlSegments[exampleIndex - 2] // Resource type
  } else {
    req.resourceId = undefined
    req.resourceType = undefined
  }

  // Log to verify extraction (for debugging purposes)
  console.log('Extracted Resource Type:', req.resourceType)
  console.log('Extracted Resource ID:', req.resourceId)

  next()
})

exampleRouter.get('/', jwtMiddleware(2), async (req, res) => {
  console.log('Getting all examples for this resource...')
  const exampleController = container.get(IDENTIFIERS.ExampleController)
  await exampleController.getAllExamples(req, res)
})

exampleRouter.get(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Example),
  async (req, res) => {
    console.log('Getting example by id...')
    const exampleController = container.get(IDENTIFIERS.ExampleController)
    await exampleController.getExampleById(req, res)
  }
)

exampleRouter.post('/', jwtMiddleware(2), async (req, res) => {
  console.log('Creating example...')
  const exampleController = container.get(IDENTIFIERS.ExampleController)
  // Pass resourceId and resourceType to controller for handling
  await exampleController.createExample(req, res)
})

exampleRouter.put(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Example),
  async (req, res) => {
    console.log('Updating example...')
    const exampleController = container.get(IDENTIFIERS.ExampleController)
    await exampleController.updateExample(req, res)
  }
)

exampleRouter.delete(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(Example),
  async (req, res) => {
    console.log('Deleting example...')
    const exampleController = container.get(IDENTIFIERS.ExampleController)
    await exampleController.deleteExample(req, res)
  }
)
