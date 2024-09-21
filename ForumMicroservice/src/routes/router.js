import express from 'express'
import IDENTIFIERS from '../config/identifiers.js'
import container from '../config/inversify.config.js'
import { jwtMiddleware } from '../middleware/jwtMiddleware.js'

export const router = express.Router()

// Welcome route
router.get('/', (req, res) => {
  res.send('Welcome to the first instance of the forum service')
})

// Get controllers from the container
const postController = container.get(IDENTIFIERS.PostController)
const webhookController = container.get(IDENTIFIERS.WebhookController)

// Routes for posts
router.post('/posts', jwtMiddleware(2), async (req, res) => {
  await postController.createPost(req, res)
})

router.post('/posts/private', jwtMiddleware(2), async (req, res) => {
  await postController.getPrivatePosts(req, res)
})

router.get('/posts/public', async (req, res) => {
  await postController.getPublicPosts(req, res)
})

router.post('/posts/all-posts', jwtMiddleware(2), async (req, res) => {
  await postController.getAllPosts(req, res)
})

router.patch('/:id', jwtMiddleware(2), async (req, res) => {
  await postController.updatePost(req, res)
})

router.delete('/:id', jwtMiddleware(2), async (req, res) => {
  await postController.deletePost(req, res)
})

// New routes for pinning and flagging posts
router.post('/posts/:postId/pin', jwtMiddleware(2), async (req, res) => {
  await postController.pinPost(req, res)
})

router.post('/posts/:postId/unpin', jwtMiddleware(2), async (req, res) => {
  await postController.unpinPost(req, res)
})

router.post('/posts/:postId/flag', jwtMiddleware(2), async (req, res) => {
  await postController.flagPost(req, res)
})

router.post('/posts/:postId/unflag', jwtMiddleware(2), async (req, res) => {
  await postController.unflagPost(req, res)
})

router.get('/:id', jwtMiddleware(2), async (req, res) => {
  await postController.getSpecificPost(req, res)
})

// More added to ensure that I can access everything
router.get('/posts/pinned', jwtMiddleware(2), async (req, res) => {
  await postController.getPinnedPosts(req, res)
})

router.get('/posts/flagged', jwtMiddleware(2), async (req, res) => {
  await postController.getFlaggedPosts(req, res)
})

router.get('/posts/:postId/actions', jwtMiddleware(2), async (req, res) => {
  await postController.checkPostActions(req, res)
})

/* TODO: REMOVE THIS ROUTE */
router.get(
  '/posts/compare/:postId1/:postId2',
  jwtMiddleware(2),
  async (req, res) => {
    await postController.compareAccessPoints(req, res)
  },
)

// Routes for webhooks (no authentication required for these as per current setup)
router.post('/webhooks', async (req, res) => {
  await webhookController.createWebhook(req, res)
})

router.delete('/webhooks/:postId', async (req, res) => {
  await webhookController.removeWebhook(req, res)
})

router.get('/webhooks', async (req, res) => {
  await webhookController.getWebhooks(req, res)
})
