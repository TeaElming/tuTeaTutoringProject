export class PostController {
  constructor(postService) {
    this.postService = postService
  }

  async createPost(req, res) {
    try {
      const post = await this.postService.createPost({
        ...req.body,
        createdBy: req.user.id,
      })
      res.status(201).json(post)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getPublicPosts(req, res) {
    try {
      const { sortOrder } = req.query
      const publicPosts = await this.postService.getPublicPosts(sortOrder)
      res.status(200).json(publicPosts)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getPrivatePosts(req, res) {
    try {
      const relationshipIds = req.body.relationshipIds
      const sortOrder = req.query.sortOrder
      if (!Array.isArray(relationshipIds)) {
        return res
          .status(400)
          .json({ error: 'relationshipIds should be an array' })
      }

      const posts = await this.postService.getPrivatePosts(
        relationshipIds,
        sortOrder,
      )
      res.status(200).json(posts)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getAllPosts(req, res) {
    try {
      const relationshipIds = req.body.relationshipIds
      const sortOrder = req.query.sortOrder

      if (!Array.isArray(relationshipIds)) {
        return res
          .status(400)
          .json({ error: 'relationshipIds should be an array' })
      }

      const posts = await this.postService.getAllPosts(
        relationshipIds,
        sortOrder,
      )
      res.status(200).json(posts)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async updatePost(req, res) {
    try {
      const { id } = req.params
      const updateData = req.body
      const userId = req.user.id

      const updatedPost = await this.postService.updatePost(
        id,
        userId,
        updateData,
      )

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' })
      }

      res.status(200).json(updatedPost)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async deletePost(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const deletedPost = await this.postService.deletePost(id, userId)

      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' })
      }

      res.status(201).json({ message: 'Successfully deleted' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async pinPost(req, res) {
    try {
      const { postId } = req.params
      const userId = req.user.id
      const action = await this.postService.pinPost(postId, userId)
      res.status(200).json(action)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async unpinPost(req, res) {
    try {
      const { postId } = req.params
      const userId = req.user.id
      const action = await this.postService.unpinPost(postId, userId)
      res.status(200).json(action)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async flagPost(req, res) {
    try {
      const { postId } = req.params
      const userId = req.user.id
      const action = await this.postService.flagPost(postId, userId)
      res.status(200).json(action)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async unflagPost(req, res) {
    try {
      const { postId } = req.params
      const userId = req.user.id
      const action = await this.postService.unflagPost(postId, userId)
      res.status(200).json(action)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getSpecificPost(req, res) {
    try {
      const { id } = req.params
      const post = await this.postService.getSpecificPost(id)
      res.status(200).json(post)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Added more methods ebcause I realised I had no way of seeing the pinned/flagged from the frontend
  async getPinnedPosts(req, res) {
    try {
      const userId = req.user.id
      const pinnedPosts = await this.postService.getPinnedPosts(userId)
      res.status(200).json(pinnedPosts)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getFlaggedPosts(req, res) {
    try {
      const userId = req.user.id
      const flaggedPosts = await this.postService.getFlaggedPosts(userId)
      res.status(200).json(flaggedPosts)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async checkPostActions(req, res) {
    try {
      const { postId } = req.params
      const userId = req.user.id
      const actions = await this.postService.checkPostActions(postId, userId)
      res.status(200).json(actions)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
