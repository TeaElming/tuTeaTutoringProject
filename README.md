# tuTea Project

## Table of Contents
- [tuTea Project](#tutea-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Repository Structure](#repository-structure)
  - [Microservices](#microservices)
    - [ForumMicroservice](#forummicroservice)
    - [ResourceMicroservice](#resourcemicroservice)
    - [TimetrackerMicroservice](#timetrackermicroservice)
    - [UserMicroservice](#usermicroservice)
    - [TuTeaReactApp](#tuteareactapp)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Project Overview
The **tuTea** project is a comprehensive tutoring platform designed to enhance language learning through the integration of multiple microservices. The platform supports interactive resources, goal setting, activity tracking, and forum discussions, all accessible through the **TuTeaReactApp**.

This repository is structured into several independent microservices, each responsible for a specific domain of the platform, and a React frontend that unifies them.

## Repository Structure

The repository is organized into the following main directories:

- **ForumMicroservice**: Manages forum posts and discussions, including private and public forums.
- **ResourceMicroservice**: Handles the management of language learning resources like vocabulary, sentences, and grammatical rules.
- **TimetrackerMicroservice**: Allows users to track their progress by logging time spent on various activities.
- **UserMicroservice**: Manages user authentication, relationships, and user data.
- **TuTeaReactApp**: The front-end interface for interacting with the microservices.

Each microservice is self-contained and designed to run independently, while the front-end app integrates their functionalities for a seamless user experience.

## Microservices

### ForumMicroservice
The **ForumMicroservice** handles all the logic related to forum posts. It provides endpoints for creating, updating, deleting, pinning, and flagging posts, with support for private and public forums. WebSockets are used for real-time communication.

For more details, see the [ForumMicroservice README](./ForumMicroservice/README.md).

### ResourceMicroservice
The **ResourceMicroservice** is responsible for managing various language learning resources, such as expressions, sentences, and vocabulary. It also includes modular routing for scalability and security using JWT authentication.

For more details, see the [ResourceMicroservice README](./ResourceMicroservice/README.md).

### TimetrackerMicroservice
The **TimetrackerMicroservice** helps users manage and log their activities, goals, and time entries. It provides real-time updates via WebSockets and supports CRUD operations for activities and goals.

For more details, see the [TimetrackerMicroservice README](./TimetrackerMicroservice/README.md).

### UserMicroservice
The **UserMicroservice** handles user registration, login, relationship management, and secure access to user data through JWT authentication. It includes endpoints for managing user information and relationships between users.

For more details, see the [UserMicroservice README](./UserMicroservice/README.md).

### TuTeaReactApp
The **TuTeaReactApp** is the front-end React application that brings all the microservices together. It provides a user-friendly interface for language learners to interact with resources, set goals, track progress, and participate in forum discussions.

For more details, see the [TuTeaReactApp README](./TuTeaReactApp/README.md).

## Installation

To install and run the tuTea platform, follow these steps:

1. Clone the repository:
   ``git clone https://your-github-repo-link``

Navigate into the directory of each microservice (e.g., ForumMicroservice, ResourceMicroservice, etc.) and follow the installation instructions in their respective README files. Generally, you'll need to:

2. Install dependencies:
   ``npm install``

3. Set up the required environment variables in a .env file.
4. Start the service for production or development.

For the TuTeaReactApp, also navigate into the TuTeaReactApp directory and follow the instructions in its README file to install dependencies and run the front-end.

## Usage

Once the microservices are up and running, navigate to the TuTeaReactApp in your browser to access the platform. Each microservice has specific API endpoints for managing resources, users, time tracking, and forum posts. Consult the individual README files for API documentation and specific usage instructions.

## Contributing
At this stage, there are no itentions of developing this platform further. If you wish to contribute to the project, please follow these steps:
1. Fork the repository.
2. Create you own feature branch:
    ``git checkout -b feature/YourFeature``
3. Commit your changes:
    ``git commit -m "Add your feature"``
4. Push to your branch:
    ``git push origin feature/YourFeature``
5. Open a Pull Request.

## License
This project is licensed under the ISC License - see the LICENSE file in each microservice for details.