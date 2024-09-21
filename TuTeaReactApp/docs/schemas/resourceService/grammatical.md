## GrammaticalRule Schema

The following describes the schema for the `GrammaticalRule` model used in the application.

### Fields

- **owner**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the owner (`User` model).

- **rule**:
  - Type: String
  - Required: true
  - Description: The grammatical rule.

- **description**:
  - Type: String
  - Required: true
  - Description: Description or explanation of the grammatical rule.

- **comment**:
  - Type: String
  - Required: false
  - Description: Additional comments or notes.

- **added**:
  - Type: Date
  - Default: Current date/time
  - Description: Date when the grammatical rule was added.

- **examples**:
  - Type: ObjectId (Array)
  - Ref: 'Example'
  - Description: References to related examples demonstrating the rule.

### Output JSON Format

When serialized to JSON, the schema includes virtual `id` field as a hexadecimal string.
