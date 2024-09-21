import { Goal } from '../models/goal.js'
import { Timelog } from '../models/timelog.js'
import { predefinedActivities } from '../data/activities.js'

export class GoalService {
  constructor(goalWebhookService) {
    this.goalWebhookService = goalWebhookService
  }

  // Validate that the activityId exists in predefinedActivities
  validateActivityId(activityId) {
    const activity = predefinedActivities.find((a) => a.id === activityId)
    if (!activity) {
      throw new Error('Invalid activity ID')
    }
  }

  // Create a goal for a user (student, tutor, or admin)
  async createGoal(
    reqUser,
    targetUserId,
    activityId,
    duration,
    period,
    deadline = null,
    isOpenEnded = false,
  ) {
    // Validate the activity ID
    this.validateActivityId(activityId)

    // Ensure that only admins, tutors, or the user themselves can create goals
    const ownerIds = []

    if (!targetUserId) {
      // Allow users to create goals for themselves
      ownerIds.push(reqUser.id)
    } else if (reqUser.permissionLevel === 1) {
      // If the user is a tutor
      if (reqUser.students.includes(targetUserId)) {
        ownerIds.push(targetUserId)
      } else {
        console.error(
          `Unauthorized attempt to create a goal for student: ${targetUserId}`,
        )
        throw new Error(
          'Unauthorized attempt to create a goal for this student',
        )
      }
    } else if (reqUser.permissionLevel === 0) {
      ownerIds.push(targetUserId)
    } else {
      // For any other case (e.g., students trying to create goals for others)
      console.error('Not authorized to create a goal for this user')
      throw new Error('Not authorized to create a goal for this user')
    }

    // Validate that duration and period are positive and meaningful
    if (duration <= 0) {
      console.error('Invalid duration. Duration must be positive.')
      throw new Error('Duration must be a positive number')
    }
    if (!['day', 'week', 'month', 'year'].includes(period)) {
      console.error(`Invalid period: ${period}`)
      throw new Error('Invalid period. Must be one of: day, week, month, year')
    }

    // Create goals for all valid ownerIds
    const createdGoals = []
    for (const ownerId of ownerIds) {
      const goal = new Goal({
        userId: ownerId,
        activityId,
        duration,
        period,
        deadline,
        isOpenEnded,
      })
      const savedGoal = await goal.save()
      // Trigger the webhook for goal creation
      await this.goalWebhookService.createGoalWebhook('goalCreated', savedGoal)
      console.log('Webhook for created goal triggered')
      createdGoals.push(savedGoal)
    }
    return createdGoals
  }

  // Get goals for a specific user (tutor/admin can access student goals)
  async getGoalsForUser(reqUser, targetUserId) {
    // Ensure that only admins or tutors can view goals for others
    if (reqUser.id !== targetUserId) {
      if (
        reqUser.permissionLevel === 2 ||
        (reqUser.permissionLevel === 1 &&
          !reqUser.students.includes(targetUserId))
      ) {
        throw new Error('Not authorized to view goals for this user')
      }
    }

    return await Goal.find({ userId: targetUserId }).exec()
  }

  // Update a goal (ensure only the owner or an authorized tutor/admin can update)
  async updateGoal(reqUser, goalId, updates) {
    const goal = await Goal.findById(goalId)
    if (!goal) throw new Error('Goal not found')

    // Ensure that only the goal owner or an authorized tutor/admin can update
    if (reqUser.id !== goal.userId.toString()) {
      if (
        reqUser.permissionLevel === 2 ||
        (reqUser.permissionLevel === 1 &&
          !reqUser.students.includes(goal.userId.toString()))
      ) {
        throw new Error('Not authorized to update this goal')
      }
    }

    // Validate the updated activity ID if it is being changed
    if (updates.activityId) {
      this.validateActivityId(updates.activityId)
    }

    Object.assign(goal, updates)
    const updatedGoal = await goal.save()
    // Optional: Trigger webhook for goal update
    await this.goalWebhookService.createGoalWebhook('goalUpdated', updatedGoal)
    console.log('Webhook for updated goal triggered')
    return updatedGoal
  }

  // Delete a goal (ensure only the owner or an authorized tutor/admin can delete)
  async deleteGoal(reqUser, goalId) {
    const goal = await Goal.findById(goalId)
    if (!goal) throw new Error('Goal not found')

    // Ensure that only the goal owner or an authorized tutor/admin can delete
    if (reqUser.id !== goal.userId.toString()) {
      if (
        reqUser.permissionLevel === 2 ||
        (reqUser.permissionLevel === 1 &&
          !reqUser.students.includes(goal.userId.toString()))
      ) {
        throw new Error('Not authorized to delete this goal')
      }
    }

    await Goal.findByIdAndDelete(goalId)
    // Trigger the webhook for goal deletion
    await this.goalWebhookService.removeGoalWebhook(goalId)
    console.log('Webhook for goal deletion triggered')
  }

  // Calculate progress for a goal with security checks
  async calculateProgress(reqUser, goalId) {
    // Fetch the goal directly from the Goal model
    const goal = await Goal.findById(goalId).exec()
    if (!goal) {
      console.error('Goal not found')
      throw new Error('Goal not found')
    }

    // Security: Ensure that only the goal owner, an authorized tutor, or an admin can access the goal
    if (reqUser.id !== goal.userId.toString()) {
      console.log(
        `reqUser.id (${reqUser.id}) does not match goal.userId (${goal.userId})`,
      )

      if (
        reqUser.permissionLevel === 2 || // Student (insufficient permission)
        (reqUser.permissionLevel === 1 &&
          !reqUser.students.includes(goal.userId.toString())) // Tutor but not authorized for this student
      ) {
        console.error(
          'Not authorized to view or calculate progress for this goal',
        )
        throw new Error(
          'Not authorized to view or calculate progress for this goal',
        )
      }
    }

    // Aggregate the total duration logged for this goal
    const totalLogged = await Timelog.aggregate([
      { $match: { goalId: goal._id } },
      { $group: { _id: null, total: { $sum: '$duration' } } },
    ])

    const totalMinutes = totalLogged[0]?.total || 0
    const progressPercentage = (totalMinutes / goal.duration) * 100

    // No Math.min function here, so progressPercentage can exceed 100%
    return {
      goal,
      totalLogged: totalMinutes,
      progressPercentage, // Allow percentages above 100%
    }
  }

  // Get a goal by ID
  async getGoalById(reqUser, goalId) {
    // Fetch the goal
    const goal = await Goal.findById(goalId).exec()
    if (!goal) {
      console.error('Goal not found')
      throw new Error('Goal not found')
    }

    // Ensure that only the goal owner, an authorized tutor, or an admin can access the goal
    if (reqUser.id !== goal.userId.toString()) {
      console.log(
        `reqUser.id (${reqUser.id}) does not match goal.userId (${goal.userId})`,
      )

      if (
        reqUser.permissionLevel === 2 || // Student (insufficient permission)
        (reqUser.permissionLevel === 1 &&
          !reqUser.students.includes(goal.userId.toString())) // Tutor but not authorized for this student
      ) {
        console.error('Not authorized to view this goal')
        throw new Error('Not authorized to view this goal')
      }
    }
    return goal
  }

  // Get all goals for a user (this is the same as getGoalsForUser, but without permission checks)
  async getGoalsByUser(userId) {
    return await Goal.find({ userId }).exec()
  }
}
