import { Timelog } from '../models/timelog.js'
import { Goal } from '../models/goal.js'
import { predefinedActivities } from '../data/activities.js'

export class TimelogService {
  constructor(timelogWebhookService) {
    this.timelogWebhookService = timelogWebhookService
  }

  // Validate that the activityId exists in predefinedActivities
  validateActivityId(activityId) {
    const activity = predefinedActivities.find((a) => a.id === activityId)
    if (!activity) {
      throw new Error('Invalid activity ID')
    }
  }

  // Validate user permissions for time log operations
  validateUserPermissions(reqUser, targetUserId) {
    // If no targetUserId is provided, operate on the reqUser's own logs
    if (!targetUserId || reqUser.id === targetUserId) {
      return reqUser.id
    }

    // If the user is a tutor
    if (reqUser.permissionLevel === 1) {
      if (reqUser.students.includes(targetUserId)) {
        return targetUserId
      } else {
        throw new Error('Unauthorized operation on this student’s time log')
      }
    }

    // Admin can operate on any user's time log
    if (reqUser.permissionLevel === 0) {
      return targetUserId
    }

    // Otherwise, throw an error
    throw new Error('Not authorized to perform this operation')
  }

  // Log time for an activity with security validation and goal validation
  async logTime(
    reqUser,
    targetUserId,
    activityId,
    comment = null,
    duration,
    goalId = null,
    timestamp = new Date(), // Default to the current time if not provided
  ) {
    // Validate the activity ID
    this.validateActivityId(activityId)

    // Validate permissions only if targetUserId is provided
    const ownerId = targetUserId
      ? this.validateUserPermissions(reqUser, targetUserId)
      : reqUser.id

    // Validate that duration is positive
    if (duration <= 0) {
      throw new Error('Duration must be a positive number')
    }

    // If goalId is provided, validate that it matches the activityId
    if (goalId) {
      const goal = await Goal.findById(goalId)
      if (!goal) {
        throw new Error('Invalid goal ID')
      }
      if (goal.activityId !== activityId) {
        throw new Error(
          'The activity ID does not match the activity associated with the goal',
        )
      }
    }

    // Create the time log
    const timelog = new Timelog({
      userId: ownerId,
      activityId,
      comment,
      duration,
      goalId,
      timestamp, // Use the provided timestamp or default to the current time
    })

    const savedTimelog = await timelog.save()
    // Trigger webhook for timelog creation
    await this.timelogWebhookService.createTimelogWebhook(
      'timelogCreated',
      savedTimelog,
    )
    console.log('Webhook for created timelog triggered')
    return savedTimelog
  }

  // Get a single time log by ID with security validation
  async getTimeLogById(reqUser, logId) {
    const timelog = await Timelog.findById(logId)
    if (!timelog) throw new Error('Time log not found')
    // Validate permissions
    this.validateUserPermissions(reqUser, timelog.userId.toString())

    return timelog
  }

  // Update a time log by ID with security validation
  async updateTimeLogById(reqUser, logId, updates) {
    const timelog = await Timelog.findById(logId)
    if (!timelog) throw new Error('Time log not found')

    // Validate permissions
    this.validateUserPermissions(reqUser, timelog.userId.toString())

    const updatedTimelog = await Timelog.findByIdAndUpdate(logId, updates, {
      new: true,
    })

    // Trigger webhook for timelog update
    await this.timelogWebhookService.createTimelogWebhook(
      'timelogUpdated',
      updatedTimelog,
    )
    console.log('Webhook for updated timelog triggered')
    return updatedTimelog
  }

  // Delete a time log by ID with security validation
  async deleteTimeLogById(reqUser, logId) {
    const timelog = await Timelog.findById(logId)
    if (!timelog) throw new Error('Time log not found')

    // Validate permissions
    this.validateUserPermissions(reqUser, timelog.userId.toString())

    await Timelog.findByIdAndDelete(logId)
    // Trigger webhook for timelog deletion
    await this.timelogWebhookService.removeTimelogWebhook(logId)
    console.log('Webhook for timelog deletion triggered')
  }

  // Get all time logs for a user with optional filters
  async getTimeLogsByUser(userId, filters = {}) {
    const query = { userId, ...filters }
    return await Timelog.find(query).exec()
  }

  // Aggregate time logs by period with log IDs
  async getAggregatedTimeLogs(
    reqUser,
    targetUserId,
    activityId,
    startDate,
    endDate,
  ) {
    // Validate user permissions only if targetUserId is provided
    const validUserId = targetUserId
      ? this.validateUserPermissions(reqUser, targetUserId)
      : reqUser.id

    // Validate the activity ID
    this.validateActivityId(activityId)

    // Perform the aggregation
    return await Timelog.aggregate([
      {
        $match: {
          userId: validUserId,
          activityId,
          timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' },
          logIds: { $push: '$_id' }, // Collect all the log IDs
        },
      },
    ])
  }
}
