# TimeService
## Table of Contents
- [TimeService](#timeservice)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [API Endpoints](#api-endpoints)
  - [API Documentation](#api-documentation)
  - [WebSocket Integration](#websocket-integration)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
## Description
TimeService is a microservice designed to manage time-related data such as activities, goals, and timelogs for the tuTea project. It provides RESTful APIs to handle CRUD operations for these entities and includes WebSocket support for real-time updates. This service is intended to be part of a larger project and interacts with other microservices within the system.

## Features
- **Activity Management:** Handle activities with endpoints to create, read, update, and delete activities.
- **Goal Management:** Manage goals related to activities and timelogs.
- **Timelog Management:** Log time entries associated with activities and goals.
- **WebSocket Support:** Real-time updates and communication with clients using WebSocket.
- **Secure API:** Implements security best practices using Helmet and CORS.

## Installation

To get started with the TimeService, follow these steps:

1. Clone the repository: ``` git clone git@gitlab.lnu.se:1dv613/student/ts223ir/projects/TimeService.git ```
2. Navigate into the project directory: ```cd TimeService```
3. Install dependencies: ```npm install```
4. Set up environment variables:
   1. Create a .env file in the root directory of the project.
   2. Add necessary environment variables such as database connection strings, JWT secrets, etc
5. Start the server:
   1. For production: ```npm start ```
   2. For development (with auto-reloading): ```npm run dev```

## Usage
### API Endpoints

The TimeService provides several endpoints under the /api/v1 prefix. Below is a brief overview of the available routes:
Activities

    GET /api/v1/activities - Retrieve all activities.
    POST /api/v1/activities - Create a new activity.
    GET /api/v1/activities/:id - Retrieve a specific activity by ID.
    PATCH /api/v1/activities/:id - Update an activity by ID.
    DELETE /api/v1/activities/:id - Delete an activity by ID.

Goals

    GET /api/v1/goals - Retrieve all goals.
    POST /api/v1/goals - Create a new goal.
    GET /api/v1/goals/:id - Retrieve a specific goal by ID.
    PATCH /api/v1/goals/:id - Update a goal by ID.
    DELETE /api/v1/goals/:id - Delete a goal by ID.

Timelogs

    GET /api/v1/timelogs - Retrieve all timelogs.
    POST /api/v1/timelogs - Create a new timelog.
    GET /api/v1/timelogs/:id - Retrieve a specific timelog by ID.
    PATCH /api/v1/timelogs/:id - Update a timelog by ID.
    DELETE /api/v1/timelogs/:id - Delete a timelog by ID.

## API Documentation
For detailed API documentation, [click here](https://documenter.getpostman.com/view/24583442/2sAXjNXB3N).


## WebSocket Integration

TimeService includes WebSocket support for real-time data updates. The WebSocket server is integrated with the HTTP server to handle connection upgrades and provide real-time capabilities to clients.

    WebSocket Features:
        Broadcast messages to all connected clients.
        Handle incoming messages from clients and respond as needed.
        Maintain active connections and manage client disconnections.

To use WebSocket features, ensure that your client supports WebSocket connections and can handle messages as per your application’s requirements.

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

## Contact

For questions or support, contact the project author, Tea Elming.