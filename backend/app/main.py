import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- Application Setup ---
app = FastAPI(
    title="FunGames API",
    description="The API backend for the FunGames web arcade.",
    version="1.0.0",
)

# --- CORS Configuration ---
# This allows the React frontend (running on a different port) to communicate with the API.
origins = [
    "http://localhost",
    "http://localhost:5173",  # Default Vite dev server port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- In-Memory Data ---
# In a real-world application, this would be in a database.
JOKES = [
    "Pourquoi les programmeurs confondent Halloween et Noël ? Parce que OCT 31 == DEC 25.",
    "Un SQL entre dans un bar, voit deux tables et leur demande : 'Je peux vous joindre ?'",
    "Il y a 10 types de personnes : ceux qui comprennent le binaire et les autres.",
    "La récursivité, c'est cool. Demande-moi encore ce que c'est !",
    "Debugging : être le détective dans un roman policier où TU es le meurtrier.",
    "Le code, c'est comme l'humour. S'il faut l'expliquer, il est mauvais.",
    "Un programmeur est quelqu'un qui transforme le café en code.",
    "Quand je tape 'git push origin master', je me sens comme un Jedi.",
    "J'ai une blague sur les pointeurs en C, mais je ne sais pas où je l'ai mise."
]

app_stats = {
    'visit_count': 0,
    'game_plays': 0
}

# --- API Endpoints ---
@app.get("/")
def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the FunGames API!"}

@app.get("/api/v1/joke")
def get_random_joke():
    """Returns a random developer joke."""
    return {"joke": random.choice(JOKES)}

@app.get("/api/v1/stats")
def get_stats():
    """Returns the global application statistics."""
    return app_stats

@app.post("/api/v1/stats/increment-visit")
def increment_visit_count():
    """Increments the site-wide visit count."""
    app_stats['visit_count'] += 1
    return {"message": "Visit count incremented.", "new_count": app_stats['visit_count']}

@app.post("/api/v1/stats/increment-gameplay")
def increment_gameplay_count():
    """Increments the total number of games played."""
    app_stats['game_plays'] += 1
    return {"message": "Game play count incremented.", "new_count": app_stats['game_plays']}
