export class RelationshipController {
  constructor(relationshipService) {
    this.relationshipService = relationshipService
  }

  async findAllRelationships(req, res) {
    try {
      const userId = req.user.id
      const relationships = await this.relationshipService.findAllRelationships(
        userId
      )
      res.status(200).json(relationships)
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error fetching relationships: ' + error.message })
    }
  }

  async findPendingRelationships(req, res) {
    try {
      const userId = req.user.id
      const relationships =
        await this.relationshipService.findPendingRelationships(userId)
      res.status(200).json(relationships)
    } catch (error) {
      res
        .status(500)
        .json({
          error: 'Error fetching pending relationships: ' + error.message,
        })
    }
  }

  async createPendingRelationship(req, res) {
    try {
      const { studentEmail, tutorEmail } = req.body
      const createdBy = req.user.id
      const relationship =
        await this.relationshipService.createPendingRelationshipByEmails(
          studentEmail,
          tutorEmail,
          createdBy
        )
      res.status(201).json(relationship)
    } catch (error) {
      res
        .status(500)
        .json({
          error: 'Error creating pending relationship: ' + error.message,
        })
    }
  }

  async confirmRelationship(req, res) {
    try {
      const { studentEmail, tutorEmail } = req.body
      const relationship =
        await this.relationshipService.confirmRelationshipByEmails(
          studentEmail,
          tutorEmail
        )
      res.status(200).json(relationship)
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error confirming relationship: ' + error.message })
    }
  }

  async getRelationshipDetails(req, res) {
    try {
      const { id } = req.params
      const relationshipDetails =
        await this.relationshipService.getRelationshipDetails(id)
      res.status(200).json(relationshipDetails)
    } catch (error) {
      res
        .status(404)
        .json({ error: 'Error finding relationship details: ' + error.message })
    }
  }

  async deleteRelationship(req, res) {
    try {
      const { studentEmail, tutorEmail } = req.body
      const result = await this.relationshipService.deleteRelationshipByEmails(
        studentEmail,
        tutorEmail
      )
      res.status(200).json(result)
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error deleting relationship: ' + error.message })
    }
  }

  async declinePendingRelationship(req, res) {
    try {
      const { studentEmail, tutorEmail } = req.body
      const result =
        await this.relationshipService.declinePendingRelationshipByEmails(
          studentEmail,
          tutorEmail
        )
      res.status(200).json(result)
    } catch (error) {
      res
        .status(500)
        .json({
          error: 'Error declining pending relationship: ' + error.message,
        })
    }
  }
}
