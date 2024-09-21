import { predefinedActivities } from '../data/activities.js'

export class ActivityService {
  // Get activity by ID
  async getActivityById(activityId) {
    const activity = predefinedActivities.find((a) => a.id === activityId)
    if (!activity) throw new Error('Activity not found')
    return activity
  }

  // Get all predefined activities
  async getAllActivities() {
    return predefinedActivities
  }
}
