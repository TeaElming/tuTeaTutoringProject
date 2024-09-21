import express from 'express'
import 'reflect-metadata'
import { activityRouter } from './api/v1/activityRouter.js'
import { goalRouter } from './api/v1/goalRouter.js'
import { timelogRouter } from './api/v1/timelogRouter.js'

export const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the timelog service for tuTea!')
})

router.use('/activities', activityRouter)
router.use('/goals', goalRouter)
router.use('/timelogs', timelogRouter)
