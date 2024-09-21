import { Expression } from '../models/expression.js'
import { GenericResource } from '../models/genericResource.js'
import { GrammaticalRule } from '../models/grammaticalRule.js'
import { Sentence } from '../models/sentence.js'
import { Vocabulary } from '../models/vocabulary.js'
import { checkOwnershipOrTutor } from '../helpers/authorisationHelper.js'

export class UnifiedResourceService {
  async getAllResources(reqUser) {
    try {
      // Fetch all resources
      const [
        expressions,
        genericResources,
        grammaticalRules,
        sentences,
        vocabularies,
      ] = await Promise.all([
        Expression.find({}),
        GenericResource.find({}),
        GrammaticalRule.find({}),
        Sentence.find({}),
        Vocabulary.find({}),
      ])

      // Filter resources based on ownership or tutor permissions
      const filterResources = (resources) =>
        resources.filter((resource) =>
          checkOwnershipOrTutor(reqUser, resource.owner)
        )

      return {
        expressions: filterResources(expressions),
        genericResources: filterResources(genericResources),
        grammaticalRules: filterResources(grammaticalRules),
        sentences: filterResources(sentences),
        vocabularies: filterResources(vocabularies),
      }
    } catch (error) {
      throw new Error(`Error fetching resources: ${error.message}`)
    }
  }

  sortResources(resourceArrays, criteria, order = 'asc') {
    const sortedResources = {}

    for (const [key, resources] of Object.entries(resourceArrays)) {
      sortedResources[key] = resources.sort((a, b) => {
        if (criteria === 'alphabetical') {
          return order === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        } else if (criteria === 'date') {
          return order === 'asc'
            ? new Date(a.added) - new Date(b.added)
            : new Date(b.added) - new Date(a.added)
        } else if (criteria === 'topic') {
          return order === 'asc'
            ? a.topic.localeCompare(b.topic)
            : b.topic.localeCompare(a.topic)
        }
      })
    }

    return sortedResources
  }
}
