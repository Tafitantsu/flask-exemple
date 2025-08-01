document.addEventListener('DOMContentLoaded', () => {
    const puzzleMoves = document.getElementById('puzzle-moves');
    const puzzleTimer = document.getElementById('puzzle-timer');
    const puzzleBest = document.getElementById('puzzle-best');
    const puzzleGrid = document.querySelector('.puzzle-grid');
    const puzzleStatus = document.getElementById('puzzle-status');
    const puzzleRestart = document.getElementById('puzzle-restart');
    const hsDisplay = document.getElementById('hs-puzzle');

    const SIZE = 3;
    let grid = [];
    let emptyTile = { row: SIZE - 1, col: SIZE - 1 };
    let moves = 0;
    let timerId = null;
    let seconds = 0;

    function checkScore() {
        // Ping API
        fetch('/api/update_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game: 'puzzle', score: seconds }),
        }).catch(error => console.error('API Error:', error));

        // Use score manager
        const isNewHighscore = updateHighscore('puzzle', seconds, true); // lowerIsBetter = true
        if (isNewHighscore) {
            puzzleBest.textContent = formatTime(seconds);
            hsDisplay.textContent = formatTime(seconds);
            playSound('success');
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
    }

    function formatTime(s) {
        const mins = Math.floor(s / 60).toString().padStart(2, '0');
        const secs = (s % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function startTimer() {
        if (timerId) clearInterval(timerId);
        seconds = 0;
        timerId = setInterval(() => {
            seconds++;
            puzzleTimer.textContent = formatTime(seconds);
        }, 1000);
    }

    function renderGrid() {
        puzzleGrid.innerHTML = '';
        puzzleGrid.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const tile = document.createElement('div');
                tile.classList.add('puzzle-tile');
                if (grid[i][j] === 0) {
                    tile.classList.add('empty');
                }
                tile.textContent = grid[i][j] === 0 ? '' : grid[i][j];
                tile.dataset.row = i;
                tile.dataset.col = j;
                puzzleGrid.appendChild(tile);
            }
        }
    }

    function checkWin() {
        let current = 1;
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (i === SIZE - 1 && j === SIZE - 1) {
                    return grid[i][j] === 0;
                }
                if (grid[i][j] !== current) {
                    return false;
                }
                current++;
            }
        }
        return true;
    }

    function handleTileClick(e) {
        if (!e.target.classList.contains('puzzle-tile') || e.target.classList.contains('empty')) {
            return;
        }

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        const dRow = Math.abs(row - emptyTile.row);
        const dCol = Math.abs(col - emptyTile.col);

        if ((dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1)) {
            grid[emptyTile.row][emptyTile.col] = grid[row][col];
            grid[row][col] = 0;
            emptyTile = { row, col };

            moves++;
            puzzleMoves.textContent = moves;
            playSound('click');

            renderGrid();

            if (checkWin()) {
                clearInterval(timerId);
                puzzleStatus.textContent = `Bravo ! Résolu en ${moves} coups et ${formatTime(seconds)}.`;
                checkScore();
            }
        }
    }

    function shuffle() {
        let count = 0;
        while(count < 100) {
            let possibleMoves = [];
            const {row, col} = emptyTile;
            if(row > 0) possibleMoves.push({r: row - 1, c: col});
            if(row < SIZE - 1) possibleMoves.push({r: row + 1, c: col});
            if(col > 0) possibleMoves.push({r: row, c: col - 1});
            if(col < SIZE - 1) possibleMoves.push({r: row, c: col + 1});

            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            grid[emptyTile.row][emptyTile.col] = grid[move.r][move.c];
            grid[move.r][move.c] = 0;
            emptyTile = { row: move.r, col: move.c };
            count++;
        }
    }

    function init() {
        moves = 0;
        puzzleMoves.textContent = moves;
        puzzleStatus.textContent = 'Replacez les tuiles dans le bon ordre.';

        grid = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
        let count = 1;
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                grid[i][j] = count++;
            }
        }
        grid[SIZE - 1][SIZE - 1] = 0;
        emptyTile = { row: SIZE - 1, col: SIZE - 1 };

        shuffle();
        renderGrid();
        startTimer();
    }

    puzzleGrid.addEventListener('click', handleTileClick);
    puzzleRestart.addEventListener('click', init);

    // Initialize
    const bestTime = getHighscore('puzzle');
    if (bestTime > 0) {
        puzzleBest.textContent = formatTime(bestTime);
        hsDisplay.textContent = formatTime(bestTime);
    }
    init();
});
