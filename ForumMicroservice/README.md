# ForumService

## Table of Contents
- [ForumService](#forumservice)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [API Endpoints](#api-endpoints)
    - [Middleware](#middleware)
    - [WebSocket Integration](#websocket-integration)
    - [Link to API Documentation](#link-to-api-documentation)
  - [Contributing](#contributing)
  - [License](#license)


## Description
ForumService is a microservice that handles the business logic for a forum, designed to be part of a larger project, tuTea. This service provides endpoints for creating, managing, and interacting with forum posts, as well as handling webhooks. It includes functionality for creating posts, pinning and flagging posts, and handling private and public posts, among other features.

## Features
- **Post Management:** Create, update, delete, and retrieve posts.
- **Post Actions:** Pin, unpin, flag, and unflag posts.
- **Private and Public Posts:** Manage private and public posts with JWT-based authentication.
- **WebSocket Support:** WebSocket integration for handling real-time connections.
- **Webhooks:** Manage webhooks for triggering actions on specific events.

## Installation

To get started with the ForumService, follow these steps:

1. Clone the repository:
   ```git clone git@gitlab.lnu.se:1dv613/student/ts223ir/projects/ForumService.git ```

2. Navigate into the project directory: ```cd ForumService```

3. Install dependencies: ```npm install```

4. Set up environment variables:
   1. Create a .env file in the root directory of the project.
   2. Add necessary environment variables such as database connection strings, JWT secrets, etc.

5. Start the server:

  For production: ```npm start```

  For development (with auto-reloading): ```npm run dev```

## Usage
### API Endpoints

The ForumService provides several endpoints under the /api/v1 prefix. Below is a brief overview of the available routes:

Post Routes
- GET /api/v1/posts/public - Retrieves all public posts.
- POST /api/v1/posts - Creates a new post (requires JWT authentication).
- PATCH /api/v1/:id - Updates a post by ID (requires JWT authentication).
- DELETE /api/v1/:id - Deletes a post by ID (requires JWT authentication).

Post Actions
- POST /api/v1/posts/:postId/pin - Pins a specific post (requires JWT authentication).
- POST /api/v1/posts/:postId/unpin - Unpins a specific post (requires JWT authentication).
- POST /api/v1/posts/:postId/flag - Flags a specific post (requires JWT authentication).
- POST /api/v1/posts/:postId/unflag - Unflags a specific post (requires JWT authentication).

Webhook Routes
- POST /api/v1/webhooks - Creates a new webhook.
- DELETE /api/v1/webhooks/:postId - Removes a webhook by post ID.
- GET /api/v1/webhooks - Retrieves all webhooks.

### Middleware
  JWT Middleware: Secures routes with JWT authentication, ensuring only authorized access to certain endpoints.

### WebSocket Integration

  Handles WebSocket connections for real-time data exchange, providing an upgrade mechanism on the server side.

### Link to API Documentation

For detailed API documentation, including request and response examples, visit the Postman API documentation.
https://documenter.getpostman.com/view/24583442/2sAXjNXAfP


## Contributing

If you wish to contribute to the project, please follow these steps:

    Fork the repository.
    Create a new feature branch (git checkout -b feature/YourFeature).
    Commit your changes (git commit -m 'Add your feature').
    Push to the branch (git push origin feature/YourFeature).
    Open a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
Contact

For questions or support, contact the project author, Tea Elming.