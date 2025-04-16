# ChatBPT - Enhanced ChatGPT Experience

This project provides an innovative user experience for interacting with ChatGPT (specifically Azure OpenAI Service in this configuration). It features a React frontend and a Node.js/Express backend managing authentication, user tiers, chat history, and secure interaction with the AI.

## Features

- **User Authentication:** Secure signup and login using JWT (via HttpOnly cookies).
- **Tiered Access:** Differentiates between 'Free' and 'Premium' users.
- **Message Limiting:** Enforces daily message limits for free users on the backend.
- **Chat History:** Stores chat conversations per user in MongoDB.
- **Secure AI Interaction:** Backend securely handles communication with Azure OpenAI Service.
- **Mock Payment/Upgrade:** Allows users to simulate upgrading from Free to Premium.
- **Modern UI:** Built with React, Vite, TypeScript, Tailwind CSS, and Shadcn/ui.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn/ui, React Router
- **Backend:** Node.js, Express.js, TypeScript (implicitly, though JS files generated), Mongoose
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (via `jsonwebtoken`), Cookies (via `cookie-parser`)
- **AI Service:** Azure OpenAI Service (via `fetch` in backend service)

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Access to a MongoDB Atlas cluster (or other MongoDB instance)
- Azure OpenAI Service API Key, Endpoint, and Deployment Name

## Project Structure

```
/
|-- server/            # Backend Node.js/Express application
|   |-- config/        # Database connection
|   |-- controllers/   # Request handling logic
|   |-- middleware/    # Authentication middleware
|   |-- models/        # Mongoose schemas (User, Chat)
|   |-- routes/        # API route definitions
|   |-- services/      # Business logic (e.g., OpenAI interaction)
|   |-- .env           # Backend environment variables (GITIGNORED)
|   |-- .gitignore     # Server-specific gitignore
|   |-- package.json   # Backend dependencies
|   `-- server.js      # Backend entry point
|-- src/               # Frontend React application
|   |-- components/    # Reusable UI components
|   |-- contexts/      # React Context API (Auth, Chat)
|   |-- hooks/         # Custom React hooks
|   |-- lib/           # Utilities (e.g., cn for Tailwind)
|   |-- pages/         # Page components (Login, Signup, Chat, etc.)
|   |-- utils/         # Frontend utilities (config loader, api helper)
|   |-- App.tsx        # Main application component with routing
|   `-- main.tsx       # Frontend entry point
|-- .env               # Frontend environment variables (GITIGNORED)
|-- .gitignore         # Root gitignore
|-- index.html         # HTML entry point
|-- package.json       # Frontend dependencies
|-- README.md          # This file
|-- tsconfig.json      # TypeScript config for frontend
`-- vite.config.ts     # Vite configuration (including proxy)
```

## Setup & Installation

1.  **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-folder-name>
    ```

2.  **Install Frontend Dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Install Backend Dependencies:**

    ```bash
    cd server
    npm install
    # or
    # yarn install
    cd ..
    ```

4.  **Configure Backend Environment Variables:**

    - Navigate to the `server/` directory.
    - Create a file named `.env`.
    - Add the following variables, replacing placeholders with your actual values:

      ```dotenv
      # server/.env
      MONGODB_URI=your_mongodb_connection_string
      JWT_SECRET=your_strong_random_jwt_secret

      # Azure OpenAI Credentials (used by backend service)
      AZURE_OPENAI_API_KEY=your_azure_openai_api_key
      AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint_url
      AZURE_OPENAI_DEPLOYMENT_NAME=your_azure_openai_deployment_name
      # AZURE_OPENAI_API_VERSION=optional_api_version (defaults to 2024-02-15-preview)
      # PORT=optional_backend_port (defaults to 5000)
      ```

5.  **Configure Frontend Environment Variables:**
    - In the **root** directory of the project.
    - Create a file named `.env`.
    - Add the following variables (these are primarily for _display_ or frontend config loading, sensitive keys used by the backend are NOT needed here):
      ```dotenv
      # .env (root directory)
      # No keys needed here anymore as the backend handles AI calls.
      # If you had other frontend-specific variables, add them here prefixed with VITE_
      # e.g., VITE_APP_TITLE=ChatBPT
      ```
      _Note: Previously, we put Azure keys here prefixed with `VITE_`. This is no longer necessary as the backend makes the AI calls.\_

## Running the Application (Development)

1.  **Start the Backend Server:**

    - Open a terminal in the `server/` directory.
    - Run:
      ```bash
      npm run dev
      ```
    - The backend should start, typically on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**

    - Open a _separate_ terminal in the **root** project directory.
    - Run:
      ```bash
      npm run dev
      ```
    - The frontend should start, typically on `http://localhost:5173`.
    - The Vite proxy configured in `vite.config.ts` will forward `/api` requests to the backend.

3.  **Access the Application:**
    - Open your web browser and navigate to `http://localhost:5173` (or the port specified by Vite).
