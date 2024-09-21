import express from 'express'
import 'reflect-metadata'
import IDENTIFIERS from '../../../config/identifiers.js'
import container from "../../../config/inversify.config.js"
import { jwtMiddleware } from '../../../middleware/jwtMiddleware.js'

const userRouter = express.Router()

// GET welcome message
userRouter.get('/', (req, res) => {
  res.send(
    'Welcome to the user service for the tuTea Tutoring API!\n You can get users by id or email, update user infromation, and delete users.'
  )
})

// GET user by email
userRouter.get('/email', jwtMiddleware(2), async (req, res) => {
  const userController = container.get(IDENTIFIERS.UserController)
  await userController.getUserByEmail(req, res)
})

// GET user by ID
userRouter.get('/:id', jwtMiddleware(2), async (req, res) => {
  const userController = container.get(IDENTIFIERS.UserController)
  await userController.getUserById(req, res)
})

// PATCH user by ID
userRouter.patch('/:id', jwtMiddleware(2), async (req, res) => {
  const userController = container.get(IDENTIFIERS.UserController)
  await userController.updateUserById(req, res)
})

// DELETE user by ID
userRouter.delete('/:id', jwtMiddleware(2), async (req, res) => {
  const userController = container.get(IDENTIFIERS.UserController)
  await userController.deleteUserById(req, res)
})

export default userRouter
