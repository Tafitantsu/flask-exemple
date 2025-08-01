from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import random
import datetime
import os
from functools import wraps

# Création de l'application Flask
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'supersecretkey123-dev')  # Utiliser une variable d'environnement en production

# Liste de blagues/citations pour la page d'accueil
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

# Statistiques globales (simulées en mémoire)
# Highscores are now managed client-side with localStorage.
app_stats = {
    'visit_count': 0,
    'game_plays': 0
}

# Middleware simple pour compter les visites
@app.before_request
def before_request_func():
    # Increment visit count only for page loads, not API calls
    if not request.path.startswith('/api'):
        app_stats['visit_count'] += 1

# Routes principales de l'application
@app.route('/')
def index():
    """Page d'accueil"""
    joke = random.choice(JOKES)
    now = datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    username = session.get('username')
    
    return render_template('index.html',
                          joke=joke,
                          now=now,
                          visit_count=app_stats['visit_count'],
                          username=username)

@app.route('/games') # Changed from /jeux to /games to match original request
def games():
    """Page des jeux"""
    return render_template('games.html', 
                          username=session.get('username'),
                          highscores=app_stats['highscores'])

@app.route('/about')
def about():
    """Page à propos"""
    return render_template('about.html', username=session.get('username'))

@app.route('/contact')
def contact():
    """Page de contact"""
    return render_template('contact.html', username=session.get('username'))

@app.route('/dashboard')
def dashboard():
    """Tableau de bord avec statistiques"""
    return render_template('dashboard.html', 
                          stats=app_stats,
                          username=session.get('username'))

# Routes pour les API et fonctionnalités
@app.route('/set_username', methods=['POST'])
def set_username():
    """Définir le nom d'utilisateur en session"""
    username = request.form.get('username')
    if username and username.strip():
        session['username'] = username.strip()
    return redirect(request.referrer or url_for('index'))

@app.route('/reset_username')
def reset_username():
    """Réinitialiser le nom d'utilisateur"""
    session.pop('username', None)
    return redirect(request.referrer or url_for('index'))

@app.route('/api/update_score', methods=['POST'])
def update_score():
    """API pour enregistrer qu'une partie a été jouée."""
    if not request.is_json:
        return jsonify({'success': False, 'error': 'Invalid request format'}), 400
        
    data = request.get_json()
    game = data.get('game')
    score = data.get('score') # Score is now handled client-side, but we can still receive it.

    if game and isinstance(score, int):
        app_stats['game_plays'] += 1
        # The client will determine if it's a new highscore.
        # This endpoint just acknowledges the play.
        return jsonify({'success': True})
    
    return jsonify({'success': False, 'error': 'Invalid data'})

@app.route('/api/stats')
def get_stats():
    """API pour récupérer les statistiques"""
    return jsonify(app_stats)

# Point d'entrée de l'application
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
