## Example Schema

The following describes the schema for the `Example` model used in the application.

### Fields

- **owner**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the owner (`User` model).

- **exampleTarget**:
  - Type: String
  - Required: true
  - Description: Target object ID for resource (_id).

- **exampleNative**:
  - Type: String
  - Required: true
  - Description: Native example string.

- **targetLanguage**:
  - Type: String
  - Required: true
  - Description: Target language for the example.

- **nativeLanguage**:
  - Type: String
  - Required: false
  - Description: Native language of the example (optional).

- **comments**:
  - Type: String
  - Required: false
  - Description: Additional comments or notes.

- **added**:
  - Type: Date
  - Default: Current date/time
  - Description: Date when the example was added.

### Output JSON Format

When serialized to JSON, the schema excludes virtual fields by default.
