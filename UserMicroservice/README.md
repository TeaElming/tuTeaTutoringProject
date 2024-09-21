# UserService
## Table of Contents
- [UserService](#userservice)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [API Endpoints](#api-endpoints)
    - [API Documentation](#api-documentation)
  - [Running Tests](#running-tests)
  - [Contributing](#contributing)
  - [License](#license)

## Description
UserService is a microservice that manages user-related functionalities for the tuTea project. It includes features for user authentication, managing user relationships, and handling user data. This service is intended to be part of a larger system, focusing solely on the business logic related to users.

## Features
- **User Authentication:** Register, login, and validate user tokens.
- **User Management:** Retrieve, update, and delete user information.
- **Relationship Management:** Manage user relationships, including creating, confirming, and deleting relationships.
- **Secure API:** JWT-based authentication and authorization to secure endpoints.
- **Modular Design:** Separate routers for authentication, relationships, and user management, ensuring scalability and maintainability.


## Installation

To get started with the UserService, follow these steps:

1. Clone the repository: ```git clone git@gitlab.lnu.se:1dv613/student/ts223ir/projects/userService.git```

2. Navigate into the project directory: ```cd userService```

3. Install dependencies: ```npm install```

4. Set up environment variables:
  1. Create a .env file in the root directory of the project.
  2. Add necessary environment variables such as database connection strings, JWT secrets, etc.

5. Start the server:

    For production: ```npm start```
    For development (with auto-reloading): ```npm run dev```

## Usage
### API Endpoints

The UserService provides several endpoints under the /api/v1 prefix. Below is a brief overview of the available routes:
Authentication

    GET /api/v1/auth - Welcome message for the authentication service.
    POST /api/v1/auth/register - Register a new user.
    POST /api/v1/auth/login - Login and authenticate a user.
    GET /api/v1/auth/quickAuth - Validate a user token quickly.

Relationships

    GET /api/v1/relationships - Welcome message for the relationship service.
    GET /api/v1/relationships/all - Retrieve all relationships (requires JWT authentication).
    GET /api/v1/relationships/pending - Retrieve pending relationships (requires JWT authentication).
    POST /api/v1/relationships - Create a pending relationship (requires JWT authentication).
    POST /api/v1/relationships/confirm - Confirm a pending relationship (requires JWT authentication).
    GET /api/v1/relationships/:id - Retrieve details of a specific relationship by ID (requires JWT authentication).
    DELETE /api/v1/relationships - Delete a specific relationship (requires JWT authentication).
    DELETE /api/v1/relationships/decline - Decline a pending relationship (requires JWT authentication).

Users

    GET /api/v1/users - Welcome message for the user service.
    GET /api/v1/users/email - Retrieve a user by email (requires JWT authentication).
    GET /api/v1/users/:id - Retrieve a user by ID (requires JWT authentication).
    PATCH /api/v1/users/:id - Update user information by ID (requires JWT authentication).
    DELETE /api/v1/users/:id - Delete a user by ID (requires JWT authentication).

###  API Documentation
For detailed API documentation, [click here](https://documenter.getpostman.com/view/24583442/2sAXjNXAy6).


## Running Tests

To run tests, use the following command:

bash

npm test

To check test coverage, use:

bash

npm run coverage

## Contributing

If you wish to contribute to the project, please follow these steps:

    Fork the repository.
    Create a new feature branch:

    bash

git checkout -b feature/YourFeature

Commit your changes:

bash

git commit -m 'Add your feature'

Push to the branch:

bash

    git push origin feature/YourFeature

    Open a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
Contact

For questions or support, contact the project author, Tea Elming.