## Brief overview
This rule file defines guidelines for handling project dependencies and important files. It emphasizes the importance of not modifying certain files while allowing them to be read for context.

## File Handling
  - Never modify critical dependency files such as `package.json`, `.env`, and any files related to the development environment.
  - It is permissible to read these files to understand the project's configuration, dependencies, and environment variables.
  - Avoid making any changes to these files, as modifications can lead to instability or break the project.
