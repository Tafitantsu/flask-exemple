document.addEventListener('DOMContentLoaded', () => {
    const memoryLevel = document.getElementById('memory-level');
    const memorySequence = document.getElementById('memory-sequence');
    const memoryHighscore = document.getElementById('memory-highscore');
    const memoryBtns = document.querySelectorAll('.memory-btn');
    const memoryStatus = document.getElementById('memory-status');
    const memoryStart = document.getElementById('memory-start');
    const hsDisplay = document.getElementById('hs-memory');

    let level = 1;
    let sequence = [];
    let playerSequence = [];
    let gameInProgress = false;
    let showingSequence = false;

    function checkScore() {
        // Ping API
        fetch('/api/update_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game: 'memory', score: level }),
        }).catch(error => console.error('API Error:', error));

        // Use score manager
        const isNewHighscore = updateHighscore('memory', level);
        if (isNewHighscore) {
            memoryHighscore.textContent = level;
            hsDisplay.textContent = level;
            playSound('success');
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
    }

    function flashButton(index) {
        return new Promise(resolve => {
            const btn = document.getElementById(`memory-btn-${index}`);
            btn.classList.add('active');
            // playSound(`memory${index}`);
            setTimeout(() => {
                btn.classList.remove('active');
                setTimeout(resolve, 250);
            }, 500);
        });
    }

    async function showSequence() {
        showingSequence = true;
        memoryStatus.textContent = 'Regardez attentivement...';
        memoryStart.disabled = true;

        for (const index of sequence) {
            await flashButton(index);
        }

        showingSequence = false;
        memoryStatus.textContent = 'À vous de jouer !';
        playerSequence = [];
    }

    function nextLevel() {
        level++;
        memoryLevel.textContent = level;
        sequence.push(Math.floor(Math.random() * 4));
        memorySequence.textContent = sequence.length;
        showSequence();
    }

    function startGame() {
        level = 1;
        sequence = [];
        playerSequence = [];
        gameInProgress = true;

        memoryLevel.textContent = level;
        memoryStart.textContent = 'Rejouer';

        sequence.push(Math.floor(Math.random() * 4));
        memorySequence.textContent = sequence.length;
        showSequence();
    }

    function endGame() {
        memoryStatus.textContent = `Jeu terminé ! Vous avez atteint le niveau ${level}.`;
        checkScore();
        gameInProgress = false;
        memoryStart.disabled = false;
    }

    memoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!gameInProgress || showingSequence) return;

            const index = parseInt(btn.dataset.index);
            flashButton(index);
            playerSequence.push(index);

            const lastPlayerInput = playerSequence[playerSequence.length - 1];
            const correspondingSequenceItem = sequence[playerSequence.length - 1];

            if (lastPlayerInput !== correspondingSequenceItem) {
                endGame();
                return;
            }

            if (playerSequence.length === sequence.length) {
                setTimeout(nextLevel, 1000);
            }
        });
    });

    memoryStart.addEventListener('click', startGame);

    // Initialize
    const highscore = getHighscore('memory');
    memoryHighscore.textContent = highscore;
    hsDisplay.textContent = highscore;
});
