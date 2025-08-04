import React, { useState, useEffect, useCallback, useRef } from 'react';
import ApiCall from '@utils/ApiCall';

const ReflexGame = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, active, done
  const [reactionTime, setReactionTime] = useState(0);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const startGame = useCallback(() => {
    setGameState('ready');
    setReactionTime(0);
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const randomDelay = Math.random() * 3000 + 1000; // 1 to 4 seconds
    timerRef.current = setTimeout(() => {
      setGameState('active');
      startTimeRef.current = new Date().getTime();
    }, randomDelay);
  }, []);

  const handleReflexClick = useCallback(() => {
    if (gameState === 'ready') {
      // Clicked too early
      clearTimeout(timerRef.current);
      setGameState('done');
      setReactionTime(-1); // Indicate too early click
    } else if (gameState === 'active') {
      // Successful click
      const endTime = new Date().getTime();
      const timeTaken = endTime - startTimeRef.current;
      setReactionTime(timeTaken);
      setGameState('done');

      // Calculate score (inverse of reaction time, higher is better)
      const score = Math.round(50000 / timeTaken);
      // Send score to backend
      ApiCall('/game/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'reflex', score: score }),
      })
        .then(data => console.log('Reflex score saved:', data))
        .catch(error => console.error('Error saving reflex score:', error));
    }
  }, [gameState]);

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getAreaStyle = () => {
    let backgroundColor = '#dc3545'; // Red (waiting/ready)
    let text = 'Attendez le vert...';

    if (gameState === 'active') {
      backgroundColor = '#28a745'; // Green (click now)
      text = 'CLIQUEZ !';
    } else if (gameState === 'done') {
      backgroundColor = '#0d6efd'; // Blue (result)
      if (reactionTime === -1) {
        text = 'Trop tôt ! Essayez encore.';
      } else {
        text = `Votre temps : ${reactionTime} ms`;
      }
    }
    return { backgroundColor, text };
  };

  const { backgroundColor, text } = getAreaStyle();

  return (
    <div id="reflex-game" className="text-center">
      <h3 className="mb-3">Jeu de Réflexe</h3>
      <p className="text-muted mb-4">Cliquez ou appuyez dès que la boîte devient verte. Ne cliquez pas trop tôt !</p>

      <div
        id="reflex-area"
        style={{
          height: '250px',
          backgroundColor: backgroundColor,
          borderRadius: 'var(--border-radius)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
        onClick={handleReflexClick}
      >
        <span id="reflex-text">{text}</span>
      </div>

      <div id="reflex-result" className="mt-4">
        {gameState === 'done' && reactionTime !== -1 && (
          <h4 className="text-success">Super réflexe !</h4>
        )}
      </div>

      {(gameState === 'waiting' || gameState === 'done') && (
        <button onClick={startGame} className="btn btn-primary mt-3">
          {gameState === 'waiting' ? 'Commencer' : 'Rejouer'}
        </button>
      )}
    </div>
  );
};

export default ReflexGame;
