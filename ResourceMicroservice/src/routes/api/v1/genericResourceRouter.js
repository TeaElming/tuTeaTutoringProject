import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from '../../../config/inversify.config.js'
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'
import { exampleRouter } from './exampleRouter.js'
import { ownershipMiddleware } from '../../../middleware/ownershipMiddleware.js'
import { GenericResource } from '../../../models/genericResource.js' // To use with middleware

export const genericResourceRouter = express.Router()

genericResourceRouter.get('/', jwtMiddleware(2), async (req, res) => {
  console.log('Getting all generic resources...')
  const genericResourceController = container.get(
    IDENTIFIERS.GenericResourceController
  )
  await genericResourceController.getAllGenericResources(req, res)
})

genericResourceRouter.get(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(GenericResource),
  async (req, res) => {
    console.log('Getting generic resource by id...')
    const genericResourceController = container.get(
      IDENTIFIERS.GenericResourceController
    )
    await genericResourceController.getGenericResourceById(req, res)
  }
)

genericResourceRouter.post('/', jwtMiddleware(2), async (req, res) => {
  console.log('Creating generic resource...')
  const genericResourceController = container.get(
    IDENTIFIERS.GenericResourceController
  )
  await genericResourceController.createGenericResource(req, res)
})

genericResourceRouter.put(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(GenericResource),
  async (req, res) => {
    console.log('Updating generic resource...')
    const genericResourceController = container.get(
      IDENTIFIERS.GenericResourceController
    )
    await genericResourceController.updateResource(req, res) // Updated method name
  }
)

genericResourceRouter.delete(
  '/:id',
  jwtMiddleware(2),
  ownershipMiddleware(GenericResource),
  async (req, res) => {
    console.log('Deleting generic resource...')
    const genericResourceController = container.get(
      IDENTIFIERS.GenericResourceController
    )
    await genericResourceController.deleteResource(req, res)
  }
)

genericResourceRouter.post('/search', jwtMiddleware(2), async (req, res) => {
  console.log('Searching for generic resource...')
  const genericResourceController = container.get(
    IDENTIFIERS.GenericResourceController
  )
  await genericResourceController.searchGeneric(req, res)
})

genericResourceRouter.use('/:id/examples', exampleRouter)
