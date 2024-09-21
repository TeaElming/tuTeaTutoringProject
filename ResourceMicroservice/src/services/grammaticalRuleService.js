import { GrammaticalRule } from '../models/grammaticalRule.js'
import { checkOwnershipOrTutor } from '../helpers/authorisationHelper.js'
import { Example } from '../models/example.js'

export class GrammaticalRuleService {
  async createGrammaticalRule(
    reqUser,
    rule,
    description,
    grammarData,
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

      const createdRules = []
      const skippedOwners = []

      for (const ownerId of ownerIds) {
        const existingRule = await GrammaticalRule.findOne({
          rule: rule,
          owner: ownerId,
        })

        if (existingRule) {
          skippedOwners.push(ownerId)
          continue
        }

        const grammaticalRuleInformation = {
          owner: ownerId,
          rule: rule,
          description: description,
          ...grammarData,
        }
        const newRule = new GrammaticalRule(grammaticalRuleInformation)
        await newRule.save()
        createdRules.push(newRule)
      }

      if (skippedOwners.length > 0) {
        console.log(
          `Skipped creating rule for owner IDs: ${skippedOwners.join(', ')}`
        )
      }

      return createdRules
    } catch (error) {
      throw new Error(`Error creating rule: ${error.message}`)
    }
  }

  async getAllGrammaticalRules(reqUser, studentIds = []) {
    try {
      let query = {}

      if (reqUser.permissionLevel === 1) {
        const validStudentIds = studentIds.filter((studentId) =>
          reqUser.students.includes(studentId)
        )

        // Fetch only the tutor's resources if studentIds is empty
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

      const grammaticalRules = await GrammaticalRule.find(query)
      return grammaticalRules
    } catch (error) {
      throw new Error(`Error fetching rules: ${error.message}`)
    }
  }

  async getGrammaticalRuleById(reqUser, ruleId) {
    try {
      const grammaticalRule = await GrammaticalRule.findById(ruleId)

      if (!grammaticalRule) {
        throw new Error('Rule not found')
      }

      if (!checkOwnershipOrTutor(reqUser, grammaticalRule.owner)) {
        throw new Error('You are not authorized to view this rule')
      }

      return grammaticalRule
    } catch (error) {
      throw new Error(`Error fetching rule: ${error.message}`)
    }
  }

  async updateRule(reqUser, ruleId, ruleData) {
    try {
      const grammaticalRule = await GrammaticalRule.findById(ruleId)

      if (!grammaticalRule) {
        throw new Error('Rule not found')
      }

      if (!checkOwnershipOrTutor(reqUser, grammaticalRule.owner)) {
        throw new Error('You are not authorized to update this rule')
      }

      const updatedRule = await GrammaticalRule.findByIdAndUpdate(
        ruleId,
        ruleData,
        {
          new: true,
        }
      )
      return updatedRule
    } catch (error) {
      throw new Error(`Error updating rule: ${error.message}`)
    }
  }

  async deleteRule(reqUser, ruleId) {
    try {
      const grammaticalRule = await GrammaticalRule.findById(ruleId)

      if (!grammaticalRule) {
        throw new Error('Rule not found')
      }

      if (!checkOwnershipOrTutor(reqUser, grammaticalRule.owner)) {
        throw new Error('You are not authorized to delete this rule')
      }

      for (const exampleId of grammaticalRule.examples) {
        Example.findByIdAndDelete(exampleId)
      }

      await GrammaticalRule.findByIdAndDelete(ruleId)
      return { message: 'Rule deleted successfully' }
    } catch (error) {
      throw new Error(`Error deleting rule: ${error.message}`)
    }
  }

  async searchGrammaticalRule(reqUser, query) {
    try {
      let searchQuery = { owner: reqUser.id }

      if (reqUser.permissionLevel === 1) {
        searchQuery = { owner: { $in: [reqUser.id, ...reqUser.students] } }
      } else if (reqUser.permissionLevel === 0) {
        searchQuery = {} // Admin has access to everything
      }

      searchQuery.$or = [
        { rule: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ]

      const grammarRules = await GrammaticalRule.find(searchQuery)
      return grammarRules
    } catch (error) {
      throw new Error(
        `Error searching grammatical rule resources: ${error.message}`
      )
    }
  }
}
