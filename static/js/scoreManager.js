// --- Score Manager ---
// A centralized place to handle getting and setting highscores from localStorage.

const SCORE_STORAGE_KEY = 'fungames_highscores';

// Function to get all highscores from localStorage
function getHighscores() {
    const scores = localStorage.getItem(SCORE_STORAGE_KEY);
    if (scores) {
        return JSON.parse(scores);
    } else {
        // Default scores if none are set
        return {
            clicker: 0,
            reflex: 0, // Lower is better, stored as time in seconds
            memory: 0,
            puzzle: 0, // Lower is better, stored as time in seconds
            typing: 0
        };
    }
}

// Function to get a specific game's highscore
function getHighscore(game) {
    const scores = getHighscores();
    return scores[game] || 0;
}

/**
 * Updates the highscore for a game.
 * @param {string} game - The name of the game (e.g., 'clicker').
 * @param {number} score - The new score.
 * @param {boolean} lowerIsBetter - Set to true if a lower score is better.
 * @returns {boolean} - True if a new highscore was set, false otherwise.
 */
function updateHighscore(game, score, lowerIsBetter = false) {
    const scores = getHighscores();
    const currentHighscore = scores[game] || 0;

    let newHighscore = false;
    if (lowerIsBetter) {
        if (currentHighscore === 0 || score < currentHighscore) {
            scores[game] = score;
            newHighscore = true;
        }
    } else {
        if (score > currentHighscore) {
            scores[game] = score;
            newHighscore = true;
        }
    }

    if (newHighscore) {
        localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scores));
    }

    return newHighscore;
}

// Function to display all highscores on the page on load
function displayAllHighscores() {
    const scores = getHighscores();
    for (const game in scores) {
        const hsDisplay = document.getElementById(`hs-${game}`);
        if (hsDisplay) {
            let score = scores[game];
            if ((game === 'reflex' || game === 'puzzle') && score > 0) {
                 // Special formatting for time-based scores
                 if(game === 'puzzle') {
                    const mins = Math.floor(score / 60).toString().padStart(2, '0');
                    const secs = (score % 60).toString().padStart(2, '0');
                    hsDisplay.textContent = `${mins}:${secs}`;
                 } else {
                    hsDisplay.textContent = score.toFixed(3);
                 }
            } else {
                hsDisplay.textContent = score;
            }
        }
    }
}

// Automatically display scores when the script is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayAllHighscores();
});
