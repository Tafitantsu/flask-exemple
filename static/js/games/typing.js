document.addEventListener('DOMContentLoaded', () => {
    const typingScore = document.getElementById('typing-score');
    const typingTimer = document.getElementById('typing-timer');
    const typingHighscore = document.getElementById('typing-highscore');
    const typingWord = document.getElementById('typing-word');
    const typingInput = document.getElementById('typing-input');
    const typingStatus = document.getElementById('typing-status');
    const typingStart = document.getElementById('typing-start');
    const hsDisplay = document.getElementById('hs-typing');

    const WORDS = [
        'python', 'flask', 'javascript', 'programmation', 'interface', 'ludique',
        'développement', 'application', 'framework', 'réactivité', 'dynamique',
        'animation', 'navigateur', 'serveur', 'moderne', 'projet', 'clavier',
        'souris', 'vitesse', 'précision', 'challenge', 'score', 'record'
    ];

    let score = 0;
    let timeRemaining = 60;
    let timerId = null;
    let gameInProgress = false;

    function checkScore() {
        // Ping API
        fetch('/api/update_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game: 'typing', score: score }),
        }).catch(error => console.error('API Error:', error));

        // Use score manager
        const isNewHighscore = updateHighscore('typing', score);
        if (isNewHighscore) {
            typingHighscore.textContent = score;
            hsDisplay.textContent = score;
            typingStatus.textContent = "Nouveau record !";
            playSound('success');
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
    }

    function showNewWord() {
        const randomIndex = Math.floor(Math.random() * WORDS.length);
        typingWord.textContent = WORDS[randomIndex];
    }

    function startGame() {
        if (gameInProgress) return;

        gameInProgress = true;
        score = 0;
        timeRemaining = 60;

        typingScore.textContent = score;
        typingTimer.textContent = timeRemaining;
        typingInput.disabled = false;
        typingInput.value = '';
        typingInput.focus();
        typingStart.textContent = 'En cours...';
        typingStart.disabled = true;

        showNewWord();

        timerId = setInterval(() => {
            timeRemaining--;
            typingTimer.textContent = timeRemaining;
            if (timeRemaining <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timerId);
        gameInProgress = false;
        typingInput.disabled = true;
        typingWord.textContent = 'Temps écoulé !';
        typingStatus.textContent = `Vous avez tapé ${score} mots en 60 secondes.`;
        typingStart.textContent = 'Rejouer';
        typingStart.disabled = false;

        checkScore();
    }

    typingInput.addEventListener('input', () => {
        if (!gameInProgress) return;

        if (typingInput.value.trim().toLowerCase() === typingWord.textContent) {
            score++;
            typingScore.textContent = score;
            typingInput.value = '';
            showNewWord();
            playSound('click');
        }
    });

    typingStart.addEventListener('click', startGame);

    // Initialize
    const highscore = getHighscore('typing');
    typingHighscore.textContent = highscore;
    hsDisplay.textContent = highscore;
});
