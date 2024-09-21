import { Expression } from '../models/expression.js'
import { checkOwnershipOrTutor } from '../helpers/authorisationHelper.js'
import { Example } from '../models/example.js'

export class ExpressionService {
  async createExpression(
    reqUser,
    expressionString,
    expressionData,
    studentIds = []
  ) {
    try {
      const ownerIds = []

      if (reqUser.permissionLevel === 1) {
        for (const studentId of studentIds) {
          if (reqUser.students.includes(studentId)) {
            ownerIds.push(studentId)
          } else {
            throw new Error(
              `Unauthorized attempt to create resource for student ID: ${studentId}`
            )
          }
        }

        if (ownerIds.length === 0) {
          ownerIds.push(reqUser.id)
        }
      } else {
        ownerIds.push(reqUser.id)
      }

      const createdExpressions = []
      const skippedOwners = []

      for (const ownerId of ownerIds) {
        const existingExpression = await Expression.findOne({
          expression: expressionString,
          owner: ownerId,
        })

        if (existingExpression) {
          skippedOwners.push(ownerId)
          continue
        }

        const expressionInformation = {
          owner: ownerId,
          expression: expressionString,
          ...expressionData,
        }
        const newExpression = new Expression(expressionInformation)
        await newExpression.save()
        createdExpressions.push(newExpression)
      }

      if (skippedOwners.length > 0) {
        console.log(
          `Skipped creating expression for owner IDs: ${skippedOwners.join(
            ', '
          )}`
        )
      }

      return createdExpressions
    } catch (error) {
      throw new Error(`Error creating expression: ${error.message}`)
    }
  }

  async getAllExpressions(reqUser, studentIds = []) {
    try {
      let query = {}

      if (reqUser.permissionLevel === 1) {
        const validStudentIds = studentIds.filter((studentId) =>
          reqUser.students.includes(studentId)
        )

        // Only include the tutor's own resources if studentIds is empty
        const ownerIds =
          validStudentIds.length > 0
            ? [reqUser.id, ...validStudentIds]
            : [reqUser.id]

        query = { owner: { $in: ownerIds } }
      } else if (reqUser.permissionLevel === 0) {
        query = {} // Admin has access to everything
      } else {
        query = { owner: reqUser.id } // Regular users can only fetch their own resources
      }

      const expressions = await Expression.find(query)

      const groupedExpressions = expressions.reduce((result, expression) => {
        const ownerId = expression.owner.toString()
        if (!result[ownerId]) {
          result[ownerId] = []
        }
        result[ownerId].push(expression)
        return result
      }, {})

      return groupedExpressions
    } catch (error) {
      throw new Error(`Error fetching expressions: ${error.message}`)
    }
  }

  async getExpressionById(reqUser, expressionId) {
    try {
      const expression = await Expression.findById(expressionId)

      if (!expression) {
        throw new Error('Expression not found')
      }

      if (!checkOwnershipOrTutor(reqUser, expression.owner)) {
        throw new Error('You are not authorized to view this expression')
      }

      return expression
    } catch (error) {
      throw new Error(`Error fetching expression: ${error.message}`)
    }
  }

  async updateExpression(reqUser, expressionId, expressionData) {
    try {
      const expression = await Expression.findById(expressionId)

      if (!expression) {
        throw new Error('Expression not found')
      }

      if (!checkOwnershipOrTutor(reqUser, expression.owner)) {
        throw new Error('You are not authorized to update this expression')
      }

      const updatedExpression = await Expression.findByIdAndUpdate(
        expressionId,
        expressionData,
        {
          new: true,
        }
      )
      return updatedExpression
    } catch (error) {
      throw new Error(`Error updating expression: ${error.message}`)
    }
  }

  async deleteExpression(reqUser, expressionId) {
    try {
      const expression = await Expression.findById(expressionId)

      if (!expression) {
        throw new Error('Expression not found')
      }

      if (!checkOwnershipOrTutor(reqUser, expression.owner)) {
        throw new Error('You are not authorized to delete this expression')
      }

      // Delete all related examples - late addition
      for (const exampleId of expression.examples) {
        await Example.findByIdAndDelete(exampleId)
      }

      await Expression.findByIdAndDelete(expressionId)
      return { message: 'Expression deleted successfully' }
    } catch (error) {
      throw new Error(`Error deleting expression: ${error.message}`)
    }
  }

  async searchExpression(reqUser, query) {
    try {
      let searchQuery = { owner: reqUser.id }

      if (reqUser.permissionLevel === 1) {
        searchQuery = { owner: { $in: [reqUser.id, ...reqUser.students] } }
      }

      searchQuery.$or = [
        { expression: { $regex: query, $options: 'i' } },
        { directTranslation: { $regex: query, $options: 'i' } },
        { meaning: { $regex: query, $options: 'i' } },
        { nativeEquivalent: { $regex: query, $options: 'i' } },
      ]

      const expressions = await Expression.find(searchQuery)
      return expressions
    } catch (error) {
      throw new Error(`Error searching expression: ${error.message}`)
    }
  }
}
