import express from 'express'
import 'reflect-metadata'
import container from "../../../config/inversify.config.js"
import IDENTIFIERS from '../../../config/identifiers.js'

const authRouter = express.Router()

// GET welcome message
authRouter.get('/', (req, res) => {
  res.send('Welcome to the user service for the tuTea Tutoring API!\n You can either register or login.')
})

// POST user to register them
authRouter.post('/register', async (req, res) => {
  console.log('Registering user...' + req.body)
  const authController = container.get(IDENTIFIERS.AuthController)
  await authController.registerUser(req, res)
})

// POST login to authenticate user
authRouter.post('/login', async (req, res) => {
  console.log('Logging in user...')
  const authController = container.get(IDENTIFIERS.AuthController)
  await authController.loginUser(req, res)
})

authRouter.get('/quickAuth', async (req, res) => {
  console.log('Validating token...')
  const authController = container.get(IDENTIFIERS.AuthController)
  await authController.quickAuth(req,res)
})

export default authRouter
