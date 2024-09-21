export class UnifiedResourceController {
  constructor(unifiedResourceService) {
    this.unifiedResourceService = unifiedResourceService
  }

  async getAllResources(req, res) {
    try {
      const resources = await this.unifiedResourceService.getAllResources(
        req.user // Pass req.user for ownership check
      )
      res.status(200).json(resources)
    } catch (error) {
      // Improved error handling with specific status codes
      const statusCode = error.message.includes('Unauthorized') ? 403 : 500
      res.status(statusCode).json({ message: error.message })
    }
  }

  async getSortedResources(req, res) {
    try {
      const { criteria, order } = req.query
      const resources = await this.unifiedResourceService.getAllResources(
        req.user // Pass req.user for ownership check
      )
      const sortedResources = this.unifiedResourceService.sortResources(
        resources,
        criteria,
        order
      )
      res.status(200).json(sortedResources)
    } catch (error) {
      // Improved error handling with specific status codes
      const statusCode = error.message.includes('Unauthorized') ? 403 : 500
      res.status(statusCode).json({ message: error.message })
    }
  }
}
