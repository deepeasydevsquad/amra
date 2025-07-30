# Gemini Workspace Configuration

This file provides context for the Gemini AI assistant to operate effectively within this project.

## Important Files & Folders

These are key files and directories that Gemini may need to interact with for common development tasks.

- `server/app.js`: Main application entry point for the Node.js server.
- `server/router/`: Contains all the API route definitions.
- `server/models/`: Defines the database schemas and models (Sequelize).
- `server/migrations/`: Database migration files.
- `server/seeders/`: Database seeder files.
- `server/config/config.json`: Main configuration for the server, including database credentials.
- `client/src/`: Main source code for the Vue.js frontend.
- `client/src/router/`: Frontend routing configuration.
- `client/src/views/`: Vue components representing application pages.
- `client/src/components/`: Reusable Vue components.
- `client/vite.config.ts`: Vite configuration for the frontend.
- `docker-compose.yml`: Defines the services, networks, and volumes for the production environment.
- `docker-compose.dev.yml`: Defines the services for the development environment.

## Do Not Touch

These files and folders are critical and should not be modified by the AI without explicit instructions from the user.

- `.env*`: Environment variables, often containing secrets. Should not be modified directly.
- `node_modules/`: Project dependencies. Managed by npm/yarn.
- `package.json`: Defines project metadata and dependencies. Modifying this directly can break the project. Use package manager commands instead.
- `.git/`: Git version control directory.
- `LICENSE`: The project's license file.
- `mysql_config/`: MySQL configuration files.
- `server/config/config.json`: **DANGER!** Contains sensitive credentials. Read-only unless specifically asked to change configuration.
- `*.code-workspace`: VS Code workspace configuration.
- `init-project.ps1`: Project initialization script.
