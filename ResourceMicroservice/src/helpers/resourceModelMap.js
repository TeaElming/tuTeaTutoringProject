import { Expression } from '../models/expression.js'
import { GenericResource } from '../models/genericResource.js'
import { GrammaticalRule } from '../models/grammaticalRule.js'
import { Sentence } from '../models/sentence.js'
import { Vocabulary } from '../models/vocabulary.js'

// Mapping of URL paths to Mongoose models
const resourceModelMap = {
  expressions: Expression,
  'generic-resources': GenericResource,
  'grammatical-rules': GrammaticalRule,
  sentences: Sentence,
  vocabularies: Vocabulary,
}

export default resourceModelMap
