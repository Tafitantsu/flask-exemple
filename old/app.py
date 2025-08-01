from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import random
import datetime
import os
from functools import wraps

# Création de l'application Flask
app = Flask(__name__)
app.secret_key = 'supersecretkey123'  # Nécessaire pour les sessions

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

# Statistiques globales (en mémoire)
app_stats = {
    'visit_count': 0,
    'game_plays': 0
}

# Routes principales de l'application
@app.route('/')
def index():
    """Page d'accueil"""
    app_stats['visit_count'] += 1
    joke = random.choice(JOKES)
    now = datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    
    username = session.get('username', '')
    
    return render_template('index.html',
                          joke=joke,
                          now=now,
                          visit_count=app_stats['visit_count'],
                          username=username)

@app.route('/games')
def games():
    """Page des jeux"""
    return render_template('games.html', 
                          username=session.get('username', ''))

@app.route('/games/<string:game_id>')
def game_template(game_id):
    """Sert le template HTML pour un jeu spécifique."""
    if game_id in ['clicker', 'reflex', 'memory', 'puzzle', 'typing']:
        return render_template(f'games/{game_id}.html')
    return "Jeu non trouvé", 404

@app.route('/about')
def about():
    """Page à propos"""
    return render_template('about.html')

@app.route('/contact')
def contact():
    """Page de contact"""
    return render_template('contact.html')

@app.route('/dashboard')
def dashboard():
    """Tableau de bord avec statistiques"""
    return render_template('dashboard.html', 
                          stats=app_stats,
                          username=session.get('username', ''))

# Routes pour les API et fonctionnalités
@app.route('/set_username', methods=['POST'])
def set_username():
    """Définir le nom d'utilisateur en session"""
    if 'username' in request.form and request.form['username'].strip():
        session['username'] = request.form['username'].strip()
    return redirect(request.referrer or url_for('index'))

@app.route('/reset_username')
def reset_username():
    """Réinitialiser le nom d'utilisateur"""
    session.pop('username', None)
    return redirect(request.referrer or url_for('index'))

@app.route('/api/stats')
def get_stats():
    """API pour récupérer les statistiques"""
    return jsonify(app_stats)

# Point d'entrée de l'application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
