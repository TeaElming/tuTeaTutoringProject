export class TimelogController {
  constructor(timeLogService) {
    this.timeLogService = timeLogService
  }

  // Log time for an activity
  // Log time for an activity
  async logTime(req, res) {
    try {
      const { activityId, targetUserId, duration, goalId, comment, timestamp } =
        req.body

      const createdTimeLogs = await this.timeLogService.logTime(
        req.user,
        targetUserId, // Pass targetUserId directly, can be null/undefined
        activityId,
        comment,
        duration,
        goalId,
        timestamp, // Pass the timestamp to the service
      )

      res.status(201).json(createdTimeLogs)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Get all time logs for a user
  async getTimeLogs(req, res) {
    try {
      const { targetUserId } = req.body

      const timeLogs = await this.timeLogService.getTimeLogsByUser(
        targetUserId || req.user.id, // Fallback to req.user.id if targetUserId is not provided
      )
      res.status(200).json(timeLogs)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Aggregate time logs by period
  async getAggregatedTimeLogs(req, res) {
    try {
      const { activityId, startDate, endDate, targetUserId } = req.body

      const aggregatedLogs = await this.timeLogService.getAggregatedTimeLogs(
        req.user,
        targetUserId, // Pass targetUserId directly, can be null/undefined
        activityId,
        startDate,
        endDate,
      )

      res.status(200).json(aggregatedLogs)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Get a single time log by ID
  async getTimeLogById(req, res) {
    try {
      const { logId } = req.params

      const timelog = await this.timeLogService.getTimeLogById(req.user, logId)
      res.status(200).json(timelog)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Update a time log by ID
  async updateTimeLogById(req, res) {
    try {
      const { logId } = req.params
      const updates = req.body

      const updatedTimelog = await this.timeLogService.updateTimeLogById(
        req.user,
        logId,
        updates,
      )
      res.status(200).json(updatedTimelog)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Delete a time log by ID
  async deleteTimeLogById(req, res) {
    try {
      const { logId } = req.params

      const deletedTimelog = await this.timeLogService.deleteTimeLogById(
        req.user,
        logId,
      )
      res.status(200).json(deletedTimelog)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
