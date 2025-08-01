document.addEventListener('DOMContentLoaded', () => {
    const reflexCurrent = document.getElementById('reflex-current');
    const reflexBest = document.getElementById('reflex-best');
    const reflexAvg = document.getElementById('reflex-avg');
    const reflexTarget = document.getElementById('reflex-target');
    const reflexMessage = document.getElementById('reflex-message');
    const reflexRestart = document.getElementById('reflex-restart');
    const hsDisplay = document.getElementById('hs-reflex');

    let state = 'waiting'; // waiting, ready, clicked
    let timer = null;
    let startTime = 0;
    let scores = [];

    function checkScore(reactionTime) {
        // Ping API
        fetch('/api/update_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game: 'reflex', score: Math.round(reactionTime * 1000) }),
        }).catch(error => console.error('API Error:', error));

        // Use score manager
        const isNewHighscore = updateHighscore('reflex', reactionTime, true); // lowerIsBetter = true
        if (isNewHighscore) {
            reflexBest.textContent = reactionTime.toFixed(3);
            hsDisplay.textContent = reactionTime.toFixed(3);
            playSound('success');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }

    function initGame() {
        state = 'waiting';
        reflexTarget.classList.remove('reflex-ready', 'reflex-clicked');
        reflexTarget.classList.add('reflex-wait');
        reflexMessage.textContent = 'Attendez que la couleur change...';

        const delay = Math.random() * 4000 + 1000;
        timer = setTimeout(() => {
            state = 'ready';
            reflexTarget.classList.remove('reflex-wait');
            reflexTarget.classList.add('reflex-ready');
            reflexMessage.textContent = 'CLIQUEZ !';
            startTime = new Date().getTime();
        }, delay);
    }

    reflexTarget.addEventListener('click', () => {
        if (state === 'waiting') {
            clearTimeout(timer);
            reflexMessage.textContent = 'Trop tôt ! Cliquez pour réessayer.';
            state = 'clicked';
            // playSound('error');
        } else if (state === 'ready') {
            const endTime = new Date().getTime();
            const reactionTime = (endTime - startTime) / 1000;

            reflexCurrent.textContent = reactionTime.toFixed(3);
            scores.push(reactionTime);

            checkScore(reactionTime);

            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            reflexAvg.textContent = avg.toFixed(3);

            state = 'clicked';
            reflexTarget.classList.remove('reflex-ready');
            reflexTarget.classList.add('reflex-clicked');
            reflexMessage.textContent = `Votre temps : ${reactionTime.toFixed(3)}s. Cliquez pour rejouer.`;
            playSound('click');
        } else if (state === 'clicked') {
            initGame();
        }
    });

    reflexRestart.addEventListener('click', () => {
        clearTimeout(timer);
        scores = [];
        reflexCurrent.textContent = '0.000';
        reflexAvg.textContent = '0.000';
        initGame();
    });

    // Initialize
    const bestTime = getHighscore('reflex');
    if (bestTime > 0) {
        reflexBest.textContent = bestTime.toFixed(3);
        hsDisplay.textContent = bestTime.toFixed(3);
    }
    initGame();
});
