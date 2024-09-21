## User Schema

The following describes the schema for the `User` model used in the application.

### Fields

- **name**:
  - Type: String
  - Required: true
  - Description: Name of the user.

- **email**:
  - Type: String
  - Required: true
  - Unique: true
  - Description: Email address of the user.
  - Validation:
    - Must be a valid email format (`validate: isEmail`).

- **password**:
  - Type: String
  - Required: true
  - Description: Password of the user.
  - Validation:
    - Minimum length: 8 characters
    - Maximum length: 255 characters

- **pendingRelationships**:
  - Type: Array of ObjectId
  - Description: Array of pending relationship references (`PendingRelationship` model).

- **students**:
  - Type: Array of ObjectId
  - Description: Array of student references (`User` model).

- **tutors**:
  - Type: Array of ObjectId
  - Description: Array of tutor references (`User` model).

- **permissionLevel**:
  - Type: Number
  - Required: true
  - Default: 1
  - Description: Permission level of the user.
    - 1: Regular user
    - 0: Admin user

- **joinedAt**:
  - Type: Date
  - Default: Current date/time
  - Description: Date when the user joined.

### Output JSON Format

When serialized to JSON, the following transformations are applied:

- Virtuals are included in the JSON output.
- The `_id` and `__v` fields are removed from the JSON output.

### Additional Information
- Passwords are hashed before being saved.

