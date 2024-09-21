## Expression Schema

The following describes the schema for the `Expression` model used in the application.

### Fields

- **owner**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the owner (`User` model).

- **expression**:
  - Type: String
  - Required: true
  - Description: Expression string.

- **directTranslation**:
  - Type: String
  - Required: false
  - Default: 'No translation available'
  - Description: Direct word-by-word translation of the expression.

- **nativeEquivalent**:
  - Type: String
  - Required: false
  - Description: Equivalent expression in the native language (optional).

- **added**:
  - Type: Date
  - Default: Current date/time
  - Description: Date when the expression was added.

- **example**:
  - Type: ObjectId (Array)
  - Ref: 'Example'
  - Description: References to related examples.

### Output JSON Format

When serialized to JSON, the schema includes virtual `id` field as a hexadecimal string.
