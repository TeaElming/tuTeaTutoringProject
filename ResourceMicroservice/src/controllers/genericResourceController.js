export class GenericResourceController {
  constructor(genericResourceService) {
    this.genericResourceService = genericResourceService
  }

  async createGenericResource(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Get student IDs from the request body
      const { targetLanguage, resource, genericData } = req.body

      const newResources =
        await this.genericResourceService.createGenericResource(
          req.user,
          targetLanguage,
          resource,
          genericData,
          studentIds
        )

      res.status(201).json(newResources)
    } catch (error) {
      res
        .status(error.message.includes('Unauthorized') ? 403 : 400)
        .json({ message: error.message })
    }
  }

  async getAllGenericResources(req, res) {
    try {
      const studentIds = req.body.studentIds || [] // Extract studentIds from request body
      const genericResources =
        await this.genericResourceService.getAllGenericResources(
          req.user, // Pass req.user for ownership check
          studentIds // Pass studentIds to the service method
        )
      res.status(200).json(genericResources)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async getGenericResourceById(req, res) {
    try {
      const genericResource =
        await this.genericResourceService.getGenericResourceById(
          req.user, // Pass req.user for ownership check
          req.params.id
        )
      res.status(200).json(genericResource)
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ message: error.message })
    }
  }

  async updateResource(req, res) {
    try {
      const updatedResource = await this.genericResourceService.updateResource(
        req.user, // Pass req.user for ownership check
        req.params.id,
        req.body
      )
      res.status(200).json(updatedResource)
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ message: error.message })
    }
  }

  async deleteResource(req, res) {
    try {
      await this.genericResourceService.deleteResource(
        req.user, // Pass req.user for ownership check
        req.params.id
      )
      res.status(204).end()
    } catch (error) {
      res
        .status(
          error.message.includes('Unauthorized')
            ? 403
            : error.message.includes('not found')
            ? 404
            : 400
        )
        .json({ message: error.message })
    }
  }

  async searchGeneric(req, res) {
    try {
      const query = req.body.query
      const generics = await this.genericResourceService.searchGeneric(
        req.user,
        query
      )
      res.status(200).json(generics)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
