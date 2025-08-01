from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# FastAPI application instance
app = FastAPI()

# CORS (Cross-Origin Resource Sharing) configuration
# This allows the frontend (running on a different port) to communicate with the backend.
origins = [
    "http://localhost:5173",  # Default Vite dev server port
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Common alternative for React dev servers
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# In-memory data store for application statistics (to match original functionality)
app_stats = {
    'visit_count': 0,
    'game_plays': 0
}

@app.get("/api/stats")
def get_stats():
    """
    Endpoint to retrieve application statistics.
    """
    return app_stats

# --- Static Files Configuration ---
# This will serve the built React app in production.
# The path is relative to the location of this 'main.py' file.
static_files_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

# We mount the static files directory to the root of the application.
# The check for the directory's existence prevents errors if the frontend hasn't been built yet.
if os.path.exists(static_files_path):
    app.mount("/", StaticFiles(directory=static_files_path, html=True), name="static")
