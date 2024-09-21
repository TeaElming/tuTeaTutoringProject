export class ExampleController {
  constructor(exampleService) {
    this.exampleService = exampleService
  }

  async createExample(req, res) {
    try {
      const {
        exampleTarget,
        exampleNative,
        targetLanguage,
        nativeLanguage,
        additionalData,
      } = req.body
      const { resourceId, resourceType } = req // Extracted from URL

      // Check for missing resourceId or resourceType
      if (!resourceId || !resourceType) {
        return res
          .status(400)
          .json({ error: 'Resource ID or type not provided' })
      }

      // Service layer should handle further validation, including null checks for other fields
      const example = await this.exampleService.createExample(
        req.user.id,
        exampleTarget,
        exampleNative,
        targetLanguage,
        nativeLanguage,
        additionalData,
        resourceId,
        resourceType
      )
      res.status(201).json(example)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async getAllExamples(req, res) {
    console.log('Get all controller')
    try {
      const examples = await this.exampleService.getAllExamples(req)
      res.status(200).json(examples)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async getExampleById(req, res) {
    try {
      const example = await this.exampleService.getExampleById(req.params.id)
      res.status(200).json(example)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async deleteExample(req, res) {
    try {
      // Ensure the middleware has set the correct resourceType and resourceId
      console.log('Received Resource Type:', req.resourceType)
      console.log('Received Resource ID:', req.resourceId)

      // Validate resourceType and resourceId before proceeding
      if (!req.resourceType || !req.resourceId) {
        return res
          .status(400)
          .json({ error: 'Resource ID or type not provided' })
      }

      // Pass these values explicitly to the service method if needed
      await this.exampleService.deleteExample(
        req.params.id,
        req.resourceId,
        req.resourceType
      )
      res.status(204).end()
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
