export class ActivityController {
  constructor(activityService) {
    this.activityService = activityService
  }

  // Get all activities
  async getAllActivities(req, res) {
    try {
      const activities = await this.activityService.getAllActivities()
      res.status(200).json(activities)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Get a specific activity by ID
  async getActivityById(req, res) {
    try {
      const activity = await this.activityService.getActivityById(req.params.id)
      res.status(200).json(activity)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }
}
