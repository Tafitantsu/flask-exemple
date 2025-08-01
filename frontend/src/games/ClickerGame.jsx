import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const ClickerGame = () => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [gameActive, setGameActive] = useState(false);
    const [finalScore, setFinalScore] = useState(null);

    const endGame = useCallback(() => {
        setGameActive(false);
        setFinalScore(score);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
        // Here we would update the high score using our context
    }, [score]);

    useEffect(() => {
        if (!gameActive) return;

        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            endGame();
        }
    }, [gameActive, timeLeft, endGame]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(10);
        setGameActive(true);
        setFinalScore(null);
    };

    const handleClick = () => {
        if (gameActive) {
            setScore(score + 1);
        }
    };

    return (
        <div className="text-center">
            <h3 className="mb-3">Clicker Fou</h3>
            <p className="text-muted mb-4">Cliquez sur le bouton le plus vite possible en 10 secondes !</p>

            <div id="game-stats" className="row justify-content-center my-4">
                <div className="col-md-4">
                    <h4>Temps restant</h4>
                    <p className="fs-3 fw-bold">{timeLeft}s</p>
                </div>
                <div className="col-md-4">
                    <h4>Score</h4>
                    <p className="fs-3 fw-bold">{score}</p>
                </div>
            </div>

            <div id="game-area">
                {!gameActive && finalScore === null && (
                    <button onClick={startGame} className="btn btn-primary btn-lg">Commencer !</button>
                )}

                {gameActive && (
                    <button id="click-btn" onClick={handleClick} className="btn btn-lg" style={{ backgroundColor: 'var(--accent-color, #ff4757)', color: 'white', width: '200px', height: '200px', borderRadius: '50%', fontSize: '1.5rem' }}>
                        Clique !
                    </button>
                )}
            </div>

            {finalScore !== null && (
                 <div id="result" className="mt-4">
                    <h4 className="text-success">Temps écoulé ! Votre score final est de {finalScore}.</h4>
                    <button onClick={startGame} className="btn btn-secondary mt-3">Rejouer</button>
                 </div>
            )}
        </div>
    );
};

export default ClickerGame;
