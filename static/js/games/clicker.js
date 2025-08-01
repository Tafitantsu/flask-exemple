document.addEventListener('DOMContentLoaded', () => {
    const clickerCounter = document.getElementById('clicker-counter');
    const clickerTimer = document.getElementById('clicker-timer');
    const clickerHighscore = document.getElementById('clicker-highscore');
    const clickerBtn = document.getElementById('clicker-btn');
    const clickerResult = document.getElementById('clicker-result');
    const finalScore = document.getElementById('final-score');
    const clickerMessage = document.getElementById('clicker-message');
    const clickerRestart = document.getElementById('clicker-restart');
    const hsDisplay = document.getElementById('hs-clicker');

    let clicks = 0;
    let timeRemaining = 10;
    let timerId = null;
    let gameInProgress = false;

    function checkScore() {
        // Ping the backend to count the game play
        fetch('/api/update_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game: 'clicker', score: clicks }),
        }).catch(error => console.error('API Error:', error));

        // Use the centralized score manager to check for a new highscore
        const isNewHighscore = updateHighscore('clicker', clicks);
        if (isNewHighscore) {
            clickerHighscore.textContent = clicks;
            hsDisplay.textContent = clicks;
            clickerMessage.textContent = "Nouveau record ! 🎉";
            playSound('success');
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        } else {
            clickerMessage.textContent = "Bien joué !";
        }
    }

    function startGame() {
        if (gameInProgress) return;

        gameInProgress = true;
        clicks = 0;
        timeRemaining = 10;

        clickerCounter.textContent = clicks;
        clickerTimer.textContent = timeRemaining;
        clickerResult.style.display = 'none';
        clickerBtn.disabled = false;
        clickerBtn.querySelector('span').textContent = 'CLIQUE !';

        if (window.audioContext && window.audioContext.state === 'suspended') {
            window.audioContext.resume();
        }

        timerId = setInterval(() => {
            timeRemaining--;
            clickerTimer.textContent = timeRemaining;

            if (timeRemaining <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timerId);
        gameInProgress = false;
        clickerBtn.disabled = true;

        finalScore.textContent = clicks;
        clickerResult.style.display = 'block';

        checkScore();
    }

    clickerBtn.addEventListener('click', () => {
        if (!gameInProgress) {
            startGame();
        }

        if (timeRemaining > 0) {
            clicks++;
            clickerCounter.textContent = clicks;
            playSound('click');

            clickerBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clickerBtn.style.transform = 'scale(1)';
            }, 50);
        }
    });

    clickerRestart.addEventListener('click', () => {
        clickerResult.style.display = 'none';
        clickerBtn.disabled = false;
        clickerBtn.querySelector('span').textContent = 'CLIQUE ICI';
        timeRemaining = 10;
        clicks = 0;
        clickerCounter.textContent = clicks;
        clickerTimer.textContent = timeRemaining;
    });

    // Initialize highscore from the score manager
    const highscore = getHighscore('clicker');
    clickerHighscore.textContent = highscore;
    hsDisplay.textContent = highscore;
});
