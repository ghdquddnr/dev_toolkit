# Project Overview

This project is a web-based utility toolkit built with React and Vite. It provides a collection of useful tools for developers, such as Base64 encoding/decoding, JSON/YAML conversion, URL encoding, hash generation, UUID generation, text diffing, 3-way text merging, Cron expression generation, Timestamp conversion, and a Color Picker. The application is designed to be run locally and is integrated with AI Studio.

# Building and Running

## Prerequisites

*   Node.js

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set the `GEMINI_API_KEY`:**
    Create a `.env.local` file in the project root and set your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
3.  **Run the app in development mode:**
    ```bash
    npm run dev
    ```
    This will start the development server, usually accessible at `http://localhost:5173`.

4.  **Build the application for production:**
    ```bash
    npm run build
    ```
    This will create a `dist` directory containing the production-ready build.

5.  **Preview the production build locally:**
    ```bash
    npm run preview
    ```

# Development Conventions

*   **Technology Stack:** The project uses React for the UI, TypeScript for type safety, and Vite as the build tool.
*   **Component-Based Architecture:** The application is structured around reusable React components, with individual tools implemented as separate components within the `tools` directory.
*   **Tool Definition:** New tools are defined in `constants.tsx`, which maps tool IDs to their respective components, names, descriptions, and icons. The `types.ts` file defines the `Tool` enum and `ToolDefinition` interface.
*   **Styling:** The project uses Tailwind CSS (inferred from class names in `App.tsx` and common React project setups, though not explicitly confirmed by reading a CSS file).
*   **Environment Variables:** Sensitive information like API keys are managed through environment variables loaded via Vite's `loadEnv` function.
*   **External Libraries:** The application dynamically loads external libraries like `jsdiff` for specific tools (e.g., Text Diff and Merge Tool).
