## Sentence Schema

The following describes the schema for the `Sentence` model used in the application.

### Fields

- **owner**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the owner (`User` model).

- **sentence**:
  - Type: String
  - Required: true
  - Description: Sentence string.

- **semanticTranslation**:
  - Type: String
  - Required: false
  - Default: 'No translation available'
  - Description: Semantic translation of the sentence.

- **directTranslation**:
  - Type: String
  - Required: false
  - Default: 'No translation available'
  - Description: Direct word-by-word translation of the sentence.

- **added**:
  - Type: Date
  - Default: Current date/time
  - Description: Date when the sentence was added.

- **example**:
  - Type: ObjectId
  - Ref: 'Example'
  - Description: Reference to a related example.

### Output JSON Format

When serialized to JSON, the schema includes virtual `id` field as a hexadecimal string.
