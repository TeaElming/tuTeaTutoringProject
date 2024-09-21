import { Post } from '../models/post.js'
import { UserPostAction } from '../models/userPostAction.js'
import mongoose from 'mongoose'

const getSortOption = (sortOrder) => {
  switch (sortOrder) {
    case 'newest':
      return { createdAt: -1 }
    case 'oldest':
      return { createdAt: 1 }
    case 'alphabetical':
      return { title: 1 }
    case 'reverse-alphabetical':
      return { title: -1 }
    default:
      return {} // Default sort option (no sorting)
  }
}

export class PostService {
  constructor(webhookService) {
    this.webhookService = webhookService
  }

  async createPost(postData) {
    const post = new Post(postData)
    try {
      console.log('PostService: Creating post with data:', postData)
      const savedPost = await post.save()
      console.log('PostService: Post saved:', savedPost)
      await this.webhookService.createWebhook('postCreated', savedPost)
      console.log('PostService: Webhook for postCreated triggered')
      return savedPost
    } catch (error) {
      console.error('PostService: Error creating post:', error)
      throw new Error(`Error creating post: ${error}`)
    }
  }

  async getPublicPosts(sortOrder = '') {
    try {
      console.log(
        'PostService: Fetching public posts with sortOrder:',
        sortOrder,
      )
      const sortOption = getSortOption(sortOrder)
      const filter = { access: 'public' }

      const publicPosts = await Post.find(filter).sort(sortOption)
      console.log('PostService: Fetched public posts:', publicPosts)
      return publicPosts
    } catch (error) {
      console.error('PostService: Error fetching public posts:', error)
      throw new Error(`Error fetching public posts: ${error}`)
    }
  }

  async getPrivatePosts(relationshipIds, sortOrder = '') {
    try {
      console.log(
        'PostService: Fetching private posts with relationshipIds:',
        relationshipIds,
        'and sortOrder:',
        sortOrder,
      )
      if (
        !Array.isArray(relationshipIds) ||
        !relationshipIds.every((id) => mongoose.Types.ObjectId.isValid(id))
      ) {
        throw new Error('Invalid relationshipIds format')
      }

      const objectIdArray = relationshipIds.map(
        (id) => new mongoose.Types.ObjectId(id),
      )
      const sortOption = getSortOption(sortOrder)
      const filter = {
        access: 'private',
        privateAccessId: { $in: objectIdArray },
      }

      const privatePosts = await Post.find(filter).sort(sortOption)
      if (!privatePosts) {
        throw new Error('No private posts found')
      }
      console.log('PostService: Fetched private posts:', privatePosts)
      return privatePosts
    } catch (error) {
      console.error('PostService: Error fetching private posts:', error)
      throw new Error(`Error fetching private posts: ${error.message}`)
    }
  }

  async getAllPosts(relationshipIds, sortOrder = '') {
    try {
      console.log(
        'PostService: Fetching all posts with relationshipIds:',
        relationshipIds,
        'and sortOrder:',
        sortOrder,
      )

      if (
        !Array.isArray(relationshipIds) ||
        !relationshipIds.every((id) => mongoose.Types.ObjectId.isValid(id))
      ) {
        console.log(
          'PostService: Invalid relationshipIds format:',
          relationshipIds,
        )
        throw new Error('Invalid relationshipIds format')
      }

      const objectIdArray = relationshipIds.map(
        (id) => new mongoose.Types.ObjectId(id),
      )
      const sortOption = getSortOption(sortOrder)
      const filter = {
        $or: [
          { access: 'public' },
          { access: 'private', privateAccessId: { $in: objectIdArray } },
        ],
      }

      const allPosts = await Post.find(filter).sort(sortOption)
      console.log('PostService: Fetched all posts:', allPosts)

      // Log private posts with their relationship IDs
      const privatePosts = allPosts.filter((post) => post.access === 'private')
      console.log('PostService: Private posts:', privatePosts)

      privatePosts.forEach((post) => {
        console.log(
          `Post ID: ${post._id}, Relationship IDs: ${post.privateAccessId}`,
        )
      })

      return allPosts
    } catch (error) {
      console.error('PostService: Error fetching all posts:', error)
      throw new Error(`Error fetching all posts: ${error.message}`)
    }
  }

  async updatePost(postId, userId, updateData) {
    try {
      console.log(
        'PostService: Updating post with id:',
        postId,
        'by userId:',
        userId,
        'with updateData:',
        updateData,
      )
      const post = await Post.findById(postId)
      if (!post) throw new Error('Post not found')
      if (post.createdBy.toString() !== userId)
        throw new Error('Not authorized to update this post')

      const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
        new: true,
        runValidators: true,
      })
      if (updatedPost) {
        console.log('PostService: Post updated:', updatedPost)
        await this.webhookService.createWebhook('postUpdated', updatedPost)
        console.log('PostService: Webhook for postUpdated triggered')
      }
      return updatedPost
    } catch (error) {
      console.error('PostService: Error updating post:', error)
      throw new Error(`Error updating post: ${error.message}`)
    }
  }

  async deletePost(postId, userId) {
    try {
      console.log(
        'PostService: Deleting post with id:',
        postId,
        'by userId:',
        userId,
      )
      const post = await Post.findById(postId)
      if (!post) throw new Error('Post not found')
      if (post.createdBy.toString() !== userId)
        throw new Error('Not authorized to delete this post')

      const deletedPost = await Post.findByIdAndDelete(postId)
      if (deletedPost) {
        console.log('PostService: Post deleted:', deletedPost)
        await this.webhookService.createWebhook('postDeleted', deletedPost)
        console.log('PostService: Webhook for postDeleted triggered')
      }
      return deletedPost
    } catch (error) {
      console.error('PostService: Error deleting post:', error)
      throw new Error(`Error deleting post: ${error.message}`)
    }
  }

  async pinPost(postId, userId) {
    try {
      console.log(
        'PostService: Pinning post with id:',
        postId,
        'by userId:',
        userId,
      )
      const userPostAction = await UserPostAction.findOneAndUpdate(
        { postId, userId },
        { $set: { pinned: true } },
        { upsert: true, new: true },
      )
      console.log('PostService: Post pinned:', userPostAction)
      return userPostAction
    } catch (error) {
      console.error('PostService: Error pinning post:', error)
      throw new Error(`Error pinning post: ${error.message}`)
    }
  }

  async unpinPost(postId, userId) {
    try {
      console.log(
        'PostService: Unpinning post with id:',
        postId,
        'by userId:',
        userId,
      )
      const userPostAction = await UserPostAction.findOneAndUpdate(
        { postId, userId },
        { $set: { pinned: false } },
        { new: true },
      )
      console.log('PostService: Post unpinned:', userPostAction)
      return userPostAction
    } catch (error) {
      console.error('PostService: Error unpinning post:', error)
      throw new Error(`Error unpinning post: ${error.message}`)
    }
  }

  async flagPost(postId, userId) {
    try {
      console.log(
        'PostService: Flagging post with id:',
        postId,
        'by userId:',
        userId,
      )
      const userPostAction = await UserPostAction.findOneAndUpdate(
        { postId, userId },
        { $set: { flagged: true } },
        { upsert: true, new: true },
      )
      console.log('PostService: Post flagged:', userPostAction)
      return userPostAction
    } catch (error) {
      console.error('PostService: Error flagging post:', error)
      throw new Error(`Error flagging post: ${error.message}`)
    }
  }

  async unflagPost(postId, userId) {
    try {
      console.log(
        'PostService: Unflagging post with id:',
        postId,
        'by userId:',
        userId,
      )
      const userPostAction = await UserPostAction.findOneAndUpdate(
        { postId, userId },
        { $set: { flagged: false } },
        { new: true },
      )
      console.log('PostService: Post unflagged:', userPostAction)
      return userPostAction
    } catch (error) {
      console.error('PostService: Error unflagging post:', error)
      throw new Error(`Error unflagging post: ${error.message}`)
    }
  }

  async getSpecificPost(postId) {
    try {
      console.log('PostService: Fetching post with id:', postId)
      const post = await Post.findById(postId)
      if (!post) {
        throw new Error('Post not found')
      }
      console.log('PostService: Fetched post:', post)
      return post
    } catch (error) {
      console.error('PostService: Error fetching post:', error)
      throw new Error(`Error fetching post: ${error.message}`)
    }
  }

  // Added more methods ebcause I realised I had no way of seeing the pinned/flagged from the frontend

  async getPinnedPosts(userId) {
    try {
      // Fetch pinned posts with populated postId
      const pinnedPosts = await UserPostAction.find({
        userId,
        pinned: true,
      })

      // Log the initial result from the database
      console.log('Initial pinned posts with populated postId:', pinnedPosts)

      console.log('Pinned posts: ', pinnedPosts)

      return pinnedPosts
    } catch (error) {
      console.error('Error fetching pinned posts:', error)
      throw new Error('Failed to fetch pinned posts')
    }
  }

  async getFlaggedPosts(userId) {
    try {
      const flaggedPosts = await UserPostAction.find({
        userId,
        flagged: true,
      })
      console.log('Flagged posts: ', flaggedPosts)
      return flaggedPosts
    } catch (error) {
      console.error('Error fetching flagged posts:', error)
      throw new Error('Failed to fetch flagged posts')
    }
  }

  async checkPostActions(postId, userId) {
    try {
      console.log(
        'PostService: Checking actions for postId:',
        postId,
        'and userId:',
        userId,
      )
      const userPostAction = await UserPostAction.findOne({ postId, userId })
      const result = {
        pinned: userPostAction?.pinned || false,
        flagged: userPostAction?.flagged || false,
      }
      console.log('PostService: Post actions:', result)
      return result
    } catch (error) {
      console.error('PostService: Error checking post actions:', error)
      throw new Error(`Error checking post actions: ${error.message}`)
    }
  }
}
