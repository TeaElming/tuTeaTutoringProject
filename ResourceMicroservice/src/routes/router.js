import express from 'express'
import 'reflect-metadata'
import { expressionRouter } from './api/v1/expressionRouter.js'
import { genericResourceRouter } from './api/v1/genericResourceRouter.js'
import { grammaticalRuleResource } from './api/v1/grammaticalRuleRouter.js'
import { sentenceRouter } from './api/v1/sentenceRouter.js'
import { vocabularyRouter } from './api/v1/vocabularyRouter.js'
import { unifiedResourceRouter } from './api/v1/unifiedRouter.js'

export const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the resource service for the tuTea Tutoring API!')
})

router.use('/expressions', expressionRouter)
router.use('/generic-resources', genericResourceRouter)
router.use('/grammatical-rules', grammaticalRuleResource)
router.use('/sentences', sentenceRouter)
router.use('/vocabularies', vocabularyRouter)
router.use('/unified-resources', unifiedResourceRouter)