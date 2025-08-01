// static/js/games.js
window.gameUtils = {
    getHighScores: function() {
        const scores = localStorage.getItem('funGamesHighScores');
        const defaultScores = { clicker: 0, reflex: 0, memory: 0, puzzle: 0, typing: 0 };
        return scores ? JSON.parse(scores) : defaultScores;
    },

    setHighScore: function(game, score) {
        const scores = this.getHighScores();
        scores[game] = score;
        localStorage.setItem('funGamesHighScores', JSON.stringify(scores));
    },

    updateHighScore: function(game, score, resultDisplayElement) {
        const highScores = this.getHighScores();
        const oldHighScore = highScores[game] || 0;

        if (score > oldHighScore) {
            this.setHighScore(game, score);
            if (resultDisplayElement) {
                const newRecordElement = document.createElement('p');
                newRecordElement.className = 'fw-bold text-warning mt-2';
                newRecordElement.textContent = 'Nouveau record personnel !';
                resultDisplayElement.appendChild(newRecordElement);
            }
            // Mettre à jour dynamiquement le meilleur score sur la carte de sélection
            const highscoreDisplay = document.querySelector(`.game-card[data-game='${game}'] .text-muted`);
            if(highscoreDisplay) {
                highscoreDisplay.textContent = `Highscore: ${score}`;
            }
        }
    }
};