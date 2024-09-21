import express from 'express'
import 'reflect-metadata'
import authRouter from './api/v1/authRouter.js'
import relationshipRouter from './api/v1/relationshipRouter.js'
import userRouter from './api/v1/userRouter.js'

export const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the user service for the tuTea Tutoring API!')
})

router.use('/auth', authRouter)
router.use('/relationships', relationshipRouter)
router.use('/users', userRouter)

