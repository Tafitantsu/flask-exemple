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
    'game_plays': 0,
    'highscores': {
        'clicker': 0,
        'reflex': 0,
        'memory': 0,
        'puzzle': 0,
        'typing': 0
    }
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

@app.route('/jeux')
def games():
    """Page des jeux"""
    return render_template('games.html', 
                          username=session.get('username', ''),
                          highscores=app_stats['highscores'])

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

@app.route('/api/update_score', methods=['POST'])
def update_score():
    """API pour mettre à jour les scores"""
    if request.is_json:
        data = request.get_json()
        game = data.get('game')
        score = data.get('score', 0)
        
        if game in app_stats['highscores'] and score > app_stats['highscores'][game]:
            app_stats['highscores'][game] = score
            return jsonify({'success': True, 'newHighscore': True})
        
        return jsonify({'success': True, 'newHighscore': False})
    
    return jsonify({'success': False, 'error': 'Invalid request format'})

@app.route('/api/stats')
def get_stats():
    """API pour récupérer les statistiques"""
    return jsonify(app_stats)

# Point d'entrée de l'application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
import random
import datetime

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Nécessaire pour les sessions

# Liste de blagues/citations
JOKES = [
    "Pourquoi les programmeurs confondent Halloween et Noël ? Parce que OCT 31 == DEC 25.",
    "Un SQL entre dans un bar, voit deux tables et leur demande : 'Je peux vous joindre ?'",
    "Il y a 10 types de personnes : ceux qui comprennent le binaire et les autres.",
    "La récursivité, c'est cool. Demande-moi encore ce que c'est !",
    "Debugging : être le détective dans un roman policier où TU es le meurtrier."
]

# Compteur de visites (en mémoire)
visit_count = 0

@app.route('/', methods=['GET', 'POST'])
def index():
    global visit_count
    visit_count += 1
    joke = random.choice(JOKES)
    now = datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')

    # Gestion du prénom
    name = session.get('name')
    if request.method == 'POST' and 'name' in request.form:
        name = request.form['name']
        session['name'] = name

    # Mini-jeu : devine le nombre
    message = ''
    if 'number' not in session:
        session['number'] = random.randint(1, 20)
        session['attempts'] = 0
    if request.method == 'POST' and 'guess' in request.form:
        try:
            guess = int(request.form['guess'])
            session['attempts'] += 1
            if guess < session['number']:
                message = 'Trop petit !'
            elif guess > session['number']:
                message = 'Trop grand !'
            else:
                message = f'Bravo ! Tu as trouvé en {session["attempts"]} essais.'
                session.pop('number')
                session.pop('attempts')
        except ValueError:
            message = 'Merci d’entrer un nombre valide.'

    return render_template('index.html',
                           joke=joke,
                           now=now,
                           visit_count=visit_count,
                           name=name,
                           message=message)

@app.route('/reset_name')
def reset_name():
    session.pop('name', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
