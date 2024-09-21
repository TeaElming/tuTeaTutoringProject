## Relationship Schema

The following describes the schema for the `Relationship` model used in the application.

### Fields

- **studentId**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the student (`User` model).

- **tutorId**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the tutor (`User` model).

- **status**:
  - Type: String
  - Default: 'pending'
  - Required: true
  - Description: Status of the relationship.
    - Possible values: 'pending', 'confirmed'.

- **createdBy**:
  - Type: ObjectId
  - Required: true
  - Description: Reference to the user who created the relationship (`User` model).

- **createdAt**:
  - Type: Date
  - Default: Current date/time
  - Description: Date when the relationship was created.

- **confirmedAt**:
  - Type: Date
  - Description: Date when the relationship was confirmed (if applicable).

### Output JSON Format

When serialized to JSON, the following transformations are applied:

- Virtuals are included in the JSON output.
- The `_id` field is converted to `id` as a hexadecimal string.
