## Vocabulary Schema

The following describes the schema for the `Vocabulary` model used in the application.

### Fields

- **owner**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the owner (`User` model).

- **word**:
  - Type: String
  - Required: true
  - Description: Vocabulary word.

- **translation**:
  - Type: Array of Strings
  - Default: ['No translation available']
  - Description: Array of translations for the vocabulary word.

- **wordGroup**:
  - Type: String
  - Required: false
  - Default: 'General'
  - Enum: ['General', 'Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection']
  - Description: Group classification of the vocabulary word.

- **added**:
  - Type: Date
  - Default: Current date/time
  - Description: Date when the vocabulary word was added.

- **example**:
  - Type: ObjectId
  - Ref: 'Example'
  - Description: Reference to a related example.

### Output JSON Format

When serialized to JSON, the schema includes virtual `id` field as a hexadecimal string.
