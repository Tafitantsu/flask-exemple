# FunGames - Refactored (FastAPI + React)

This project is a refactored version of the FunGames web arcade, migrating from a monolithic Flask application to a modern, decoupled architecture using FastAPI for the backend and React (with Vite) for the frontend.

## Architecture

- **Backend:** A pure JSON API built with **FastAPI**. It handles game logic, stats, and serves data to the frontend.
- **Frontend:** A Single-Page Application (SPA) built with **React** and **Vite**. It provides a dynamic and interactive user interface.

## Project Structure

- **/backend:** Contains the FastAPI application.
- **/frontend:** Contains the React/Vite application.

## How to Run

### 1. Run the Backend (FastAPI)

\`\`\`bash
# Navigate to the backend directory
cd backend

# (Recommended) Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
\`\`\`
The backend API will be available at `http://127.0.0.1:8000`.

### 2. Run the Frontend (React)

\`\`\`bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`
The frontend application will be available at `http://localhost:5173` (or another port if specified by Vite).
