import React, { useState, useRef, useEffect, useCallback } from 'react';
import ApiCall from '@utils/ApiCall';

const GAME_DURATION = 10; // secondes

const ClickerGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setShowResult(false);
    setGameActive(true);
    startTimeRef.current = Date.now();
    updateTimer(); // lancer la boucle
  };

  const updateTimer = () => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000; // en secondes
    const remaining = Math.max(0, GAME_DURATION - elapsed);
    setTimeLeft(remaining.toFixed(1)); // ou Math.ceil(remaining) pour des secondes pleines

    if (remaining > 0) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      endGame();
    }
  };

  const handleClick = () => {
    if (gameActive) {
      setScore(prev => prev + 1);
    }
  };

  const endGame = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
    setGameActive(false);
    setShowResult(true);

    ApiCall('/game/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'clicker', score }),
    })
      .then(response => response.json())
      .then(data => console.log('Score saved:', data))
      .catch(error => console.error('Error saving score:', error));
  }, [score]);

  useEffect(() => {
    return () => cancelAnimationFrame(animationFrameRef.current); // cleanup on unmount
  }, []);

  return (
    <div className="text-center">
      <h3 className="mb-3">Clicker Fou</h3>
      <p className="text-muted mb-4">
        Cliquez le plus vite possible en {GAME_DURATION} secondes !
      </p>

      {!gameActive && !showResult && (
        <button onClick={startGame} className="btn btn-primary btn-lg">
          Commencer !
        </button>
      )}

      {gameActive && (
        <div>
          <button
            onClick={handleClick}
            className="btn btn-lg"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              fontSize: '1.5rem',
              transition: 'transform 0.1s ease',
            }}
          >
            Clique !
          </button>
        </div>
      )}

      <div className="mt-4">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <h4>Temps restant</h4>
            <p className="fs-3 fw-bold">{parseFloat(timeLeft).toFixed(1)}s</p>
          </div>
          <div className="col-md-4">
            <h4>Score</h4>
            <p className="fs-3 fw-bold">{score}</p>
          </div>
        </div>
      </div>

      {showResult && (
        <div className="mt-4">
          <h4 className="text-success">
            Temps écoulé ! Votre score final est de {score}.
          </h4>
          <button onClick={startGame} className="btn btn-secondary mt-3">
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
};

export default ClickerGame;
