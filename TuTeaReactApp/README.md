# tuTea

tuTea is a tutoring platform built with React, designed to support language learning through interactive resources and games. It integrates with four standalone microservices, which must be configured via environment variables. The platform allows users to create, update, read, delete, and store resources such as vocabulary, expressions, sentences, and grammatical rules. Users can also engage with games designed to practice these resources, set and track goals linked to different activities, and log time spent on various learning activities.

## Getting Started

To get started with tuTea on GitLab, follow these initial steps. Already proficient with GitLab? Modify this README.md as needed or use the template provided at the end for customization.

### Add Your Files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files to your repository.
- [ ] Use the command line to add files or push an existing repository:

```bash
cd existing_repo
git remote add origin https://gitlab.lnu.se/1dv613/student/ts223ir/projects/tuTea.git
git branch -M main
git push -uf origin main

```

### Features

    Resource Management: Users can manage educational resources such as vocabulary and grammatical rules.
    Interactive Games: Engage with games that utilize the resources for better learning.
    Goal and Activity Tracking: Set goals related to language learning and track progress.
    Forum Interaction: Users can create public or tutor-linked private posts within forums.

## Next Steps in Development

    Enhance tutor functionalities to better manage student resources and access logs and goals.
    Develop additional games for diverse practice opportunities.
    Expand commenting features on forum posts to increase community interaction.
    Refactor the project to streamline repeated interfaces.
    Integrate a translation tool to help users understand resources in their native language.

### Installation

    Clone the repository:

bash

git clone https://gitlab.lnu.se/1dv613/student/ts223ir/projects/tuTea.git

    Install dependencies:

bash

npm install

    Set up required environment variables for microservices in a .env file.
    Run the application:

bash

npm start

## Usage

To use tuTea, navigate through the user-friendly interface to access different functionalities like resource management, playing games, or interacting in forums.


## Contributing

Contributions are welcome! To contribute to tuTea, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request from your feature branch to the `main` branch.

For major changes, please open an issue first to discuss what you would like to change. Please ensure to update tests as appropriate.



## Authors and acknowledgment
    Tea Elming - Initial work and ongoing development.

Thank you to all contributors who have invested their time in improving this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Project status
Development is ongoing with plans for future enhancements. Current efforts are focused on expanding tutor functionalities and integrating new language learning games.