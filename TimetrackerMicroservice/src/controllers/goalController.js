export class GoalController {
  constructor(goalService) {
    this.goalService = goalService
  }

  // Create a new goal
  async createGoal(req, res) {
    try {
      const {
        targetUserId,
        activityId,
        duration,
        period,
        deadline = null, // Set default if not provided
        isOpenEnded = false, // Set default if not provided
      } = req.body

      // Validate required fields
      if (!activityId || !duration || !period) {
        return res.status(400).json({
          error: 'Missing required fields: activityId, duration, or period.',
        })
      }

      // Call the service to create the goal
      const createdGoals = await this.goalService.createGoal(
        req.user,
        targetUserId,
        activityId,
        duration,
        period,
        deadline,
        isOpenEnded,
      )
      res.status(201).json(createdGoals)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Get all goals for a user
  async getGoals(req, res) {
    try {
      const goals = await this.goalService.getGoalsForUser(
        req.user,
        req.params.userId,
      )
      res.status(200).json(goals)
    } catch (error) {
      res.status(403).json({ error: error.message })
    }
  }

  // Get specific goal by ID
  async getGoalById(req, res) {
    try {
      const goal = await this.goalService.getGoalById(req.user, req.params.id)
      res.status(200).json(goal)
    } catch (error) {
      res.status(403).json({ error: error.message })
    }
  }

  // Update a goal
  async updateGoal(req, res) {
    try {
      const updatedGoal = await this.goalService.updateGoal(
        req.user,
        req.params.id,
        req.body,
      )
      res.status(200).json(updatedGoal)
    } catch (error) {
      res.status(403).json({ error: error.message })
    }
  }

  // Delete a goal
  async deleteGoal(req, res) {
    try {
      await this.goalService.deleteGoal(req.user, req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(403).json({ error: error.message })
    }
  }

  // Calculate progress for a goal
  async calculateProgress(req, res) {
    console.log(`Received goalId: ${req.params.id}`)
    try {
      const progress = await this.goalService.calculateProgress(
        req.user,
        req.params.id,
      ) // Pass req.user and req.params.id
      res.status(200).json(progress)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }
}
