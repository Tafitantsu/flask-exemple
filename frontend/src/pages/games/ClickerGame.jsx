import React, { useState, useEffect, useCallback } from 'react';

const GAME_DURATION = 10;

const ClickerGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
    setShowResult(false);
  };

  const handleClick = () => {
    if (gameActive) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const endGame = useCallback(() => {
    setGameActive(false);
    setShowResult(true);
    // Save the score to the backend
    fetch('http://localhost:8000/api/game/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'clicker', score: score }),
    })
      .then(response => response.json())
      .then(data => console.log('Score saved:', data))
      .catch(error => console.error('Error saving score:', error));
  }, [score]);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, endGame]);

  return (
    <div id="clicker-game" className="text-center">
      <h3 className="mb-3">Clicker Fou</h3>
      <p className="text-muted mb-4">Cliquez sur le bouton le plus vite possible en {GAME_DURATION} secondes !</p>

      <div id="game-area">
        {!gameActive && !showResult && (
          <button onClick={startGame} className="btn btn-primary btn-lg">Commencer !</button>
        )}
        
        {gameActive && (
          <div id="click-zone">
            <button onClick={handleClick} className="btn btn-lg" style={{ backgroundColor: 'var(--accent-color)', color: 'white', width: '200px', height: '200px', borderRadius: '50%', fontSize: '1.5rem', transition: 'transform 0.1s ease' }}>Clique !</button>
          </div>
        )}
      </div>

      <div id="game-stats" className="mt-4">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <h4>Temps restant</h4>
            <p id="timer" className="fs-3 fw-bold">{timeLeft}s</p>
          </div>
          <div className="col-md-4">
            <h4>Score</h4>
            <p id="score" className="fs-3 fw-bold">{score}</p>
          </div>
        </div>
      </div>

      {showResult && (
        <div id="result" className="mt-4">
          <h4 className="text-success">Temps écoulé ! Votre score final est de {score}.</h4>
          <button onClick={startGame} className="btn btn-secondary mt-3">Rejouer</button>
        </div>
      )}
    </div>
  );
};

export default ClickerGame;
