# ResourceService
## Table of Contents
- [ResourceService](#resourceservice)
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
ResourceService is a microservice designed to handle the business logic for managing various resources, such as expressions, generic resources, grammatical rules, sentences, vocabularies, and unified resources. It is intended to be used as part of the larger tuTea project, providing a dedicated service for resource management within the tutoring API.

## Features
- **Resource Management:** Handles CRUD operations for various types of resources, including expressions, sentences, and vocabulary.
- **Microservice Architecture:** Designed to be a modular component of a larger system, focusing solely on resource-related functionalities.
- **Secure:** Implements security best practices using Helmet and CORS.
- **Modular Routing:** Separate routers for different resource types, ensuring clear separation of concerns and easy scalability.



## Installation

To get started with the ResourceService, follow these steps:

1. Clone the repository:
   ```git clone git@gitlab.lnu.se:1dv613/student/ts223ir/projects/ResourceService.git```

2. Navigate into the project directory: ```cd ResourceService```

3. Install dependencies: ```npm install```

4. Set up environment variables:
   1. Create a .env file in the root directory of the project.
   2. Add necessary environment variables such as database connection strings, JWT secrets, etc.

5. Start the server:
  For production: ```npm start```
  For development (with auto-reloading): ```npm run dev```

## Usage
### API Endpoints

The ResourceService provides several endpoints under the /api/v1 prefix. Below is a brief overview of the available routes:
Expressions

    GET /api/v1/expressions - Retrieve all expressions.
    POST /api/v1/expressions - Create a new expression.
    GET /api/v1/expressions/:id - Retrieve a specific expression by ID.
    PATCH /api/v1/expressions/:id - Update an existing expression by ID.
    DELETE /api/v1/expressions/:id - Delete an expression by ID.

Grammatical Rules

    GET /api/v1/grammatical-rules - Retrieve all grammatical rules.
    POST /api/v1/grammatical-rules - Create a new grammatical rule.
    GET /api/v1/grammatical-rules/:id - Retrieve a specific grammatical rule by ID.
    PATCH /api/v1/grammatical-rules/:id - Update a grammatical rule by ID.
    DELETE /api/v1/grammatical-rules/:id - Delete a grammatical rule by ID.

Sentences

    GET /api/v1/sentences - Retrieve all sentences.
    POST /api/v1/sentences - Create a new sentence.
    GET /api/v1/sentences/:id - Retrieve a specific sentence by ID.
    PATCH /api/v1/sentences/:id - Update a sentence by ID.
    DELETE /api/v1/sentences/:id - Delete a sentence by ID.

Vocabularies

    GET /api/v1/vocabularies - Retrieve all vocabularies.
    POST /api/v1/vocabularies - Create a new vocabulary entry.
    GET /api/v1/vocabularies/:id - Retrieve a specific vocabulary entry by ID.
    PATCH /api/v1/vocabularies/:id - Update a vocabulary entry by ID.
    DELETE /api/v1/vocabularies/:id - Delete a vocabulary entry by ID.

Unified Resources

    GET /api/v1/unified-resources - Retrieve all unified resources.


## API Documentation
For detailed API documentation, [click here](https://documenter.getpostman.com/view/24583442/2sAXjNXAtf).


## Running Tests

To run tests, use the following command: ```npm test```

To check test coverage, use: ```npm run coverage```

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