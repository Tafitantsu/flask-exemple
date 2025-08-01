from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import random
from typing import Optional
import json
import os

# FastAPI application instance
app = FastAPI()

# CORS (Cross-Origin Resource Sharing) configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

# File path for high scores persistence
HIGH_SCORES_FILE = "high_scores.json"

# In-memory data stores
app_stats = {
    'visit_count': 0,
    'game_plays': 0
}
user_data = {
    "username": None
}

# Default high scores
default_high_scores = {
    "clicker": 0,
    "reflex": 0,
    "memory": 0,
    "puzzle": 0,
    "typing": 0
}

high_scores = {}

JOKES = [
    "Pourquoi les programmeurs confondent Halloween et Noël ? Parce que OCT 31 == DEC 25.",
    "Un SQL entre dans un bar, voit deux tables et leur demande : 'Je peux vous joindre ?'",
    "Il y a 10 types de personnes : ceux qui comprennent le binaire et les autres.",
]

# Functions to load and save high scores
def load_high_scores():
    global high_scores
    if os.path.exists(HIGH_SCORES_FILE):
        with open(HIGH_SCORES_FILE, "r") as f:
            high_scores = json.load(f)
    else:
        high_scores = default_high_scores.copy()

def save_high_scores():
    with open(HIGH_SCORES_FILE, "w") as f:
        json.dump(high_scores, f)

# Load high scores on startup
load_high_scores()

# API Endpoints
@app.post("/api/visit")
def increment_visit_count():
    app_stats['visit_count'] += 1
    return {"visit_count": app_stats['visit_count']}

@app.get("/api/joke")
def get_joke():
    return {"joke": random.choice(JOKES)}

@app.get("/api/stats")
def get_stats():
    return app_stats

@app.get("/api/user")
def get_user():
    return user_data

@app.post("/api/user")
async def set_user(request: Request):
    data = await request.json()
    username = data.get("username")
    if username and username.strip():
        user_data["username"] = username.strip()
    return user_data

@app.delete("/api/user")
def reset_user():
    user_data["username"] = None
    return user_data

@app.post("/api/game/score")
async def save_score(request: Request):
    data = await request.json()
    game = data.get("game")
    score = data.get("score")
    
    # Check if game exists in high_scores and if the new score is higher or equal (if current is 0)
    if game in high_scores and (score > high_scores[game] or (score == 0 and high_scores[game] == 0)):
        high_scores[game] = score
        save_high_scores() # Save to file after update
    app_stats['game_plays'] += 1
    return {"status": "success", "high_scores": high_scores}

@app.get("/api/game/highscores")
def get_highscores():
    return high_scores

# Static Files Configuration
static_files_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(static_files_path):
    app.mount("/", StaticFiles(directory=static_files_path, html=True), name="static")