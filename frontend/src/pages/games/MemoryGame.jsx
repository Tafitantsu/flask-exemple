import React, { useState, useEffect, useCallback, useRef } from 'react';

const COLORS = ['green', 'red', 'blue', 'yellow'];
const LIGHT_DURATION = 400; // How long the pad stays lit
const SEQUENCE_PAUSE = 800; // Time between each light in sequence

const MemoryGame = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameActive, setGameActive] = useState(false); // True when player can input
  const [instructions, setInstructions] = useState("Mémorisez la séquence de couleurs et répétez-la.");
  const [result, setResult] = useState(null);

  const playSequenceRef = useRef(null);

  const lightUpPad = useCallback((color) => {
    const pad = document.getElementById(`pad-${color}`);
    if (pad) {
      pad.classList.add('active');
      // window.playClickSound(); // Uncomment if you have sound effects
      setTimeout(() => {
        pad.classList.remove('active');
      }, LIGHT_DURATION);
    }
  }, []);

  const playSequence = useCallback(() => {
    let i = 0;
    setGameActive(false); // Disable player input during sequence playback
    setInstructions("Regardez bien...");

    playSequenceRef.current = setInterval(() => {
      if (i >= sequence.length) {
        clearInterval(playSequenceRef.current);
        setInstructions("À vous de jouer !");
        setGameActive(true); // Enable player input
        return;
      }
      lightUpPad(sequence[i]);
      i++;
    }, SEQUENCE_PAUSE);
  }, [sequence, lightUpPad]);

  const endGame = useCallback((isSuccess = false) => {
    setGameActive(false);
    clearInterval(playSequenceRef.current);
    const finalScore = level - (isSuccess ? 0 : 1); // If success, score is level, else level - 1
    setResult({
      message: isSuccess ? `Félicitations ! Votre score final est de ${finalScore}.` : `Mauvaise séquence ! Votre score final est de ${finalScore}.`,
      type: isSuccess ? 'success' : 'danger',
      score: finalScore
    });

    // Send score to backend
    fetch('http://localhost:8000/api/game/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'memory', score: finalScore }),
    })
      .then(response => response.json())
      .then(data => console.log('Memory score saved:', data))
      .catch(error => console.error('Error saving memory score:', error));

  }, [level]);

  const nextLevel = useCallback(() => {
    setLevel(prevLevel => prevLevel + 1);
    setPlayerSequence([]);
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence(prevSequence => [...prevSequence, newColor]);
  }, []);

  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence, playSequence]);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(0);
    setResult(null);
    setGameActive(false);
    // Start the first level after a small delay to reset UI
    setTimeout(nextLevel, 500);
  };

  const handlePlayerInput = useCallback((color) => {
    if (!gameActive) return;

    lightUpPad(color);
    setPlayerSequence(prevPlayerSequence => {
      const newPlayerSequence = [...prevPlayerSequence, color];
      const lastIndex = newPlayerSequence.length - 1;

      if (newPlayerSequence[lastIndex] !== sequence[lastIndex]) {
        endGame(false);
        return newPlayerSequence;
      }

      if (newPlayerSequence.length === sequence.length) {
        if (newPlayerSequence.length === 5) { // Example: Win after 5 levels
          endGame(true);
        } else {
          setTimeout(nextLevel, 1000);
        }
      }
      return newPlayerSequence;
    });
  }, [gameActive, sequence, lightUpPad, nextLevel, endGame]);

  useEffect(() => {
    return () => {
      if (playSequenceRef.current) {
        clearInterval(playSequenceRef.current);
      }
    };
  }, []);

  return (
    <div id="memory-game" className="text-center">
      <h3 className="mb-3">Vitesse Cérébrale</h3>
      <p id="memory-instructions" className="text-muted mb-4">{instructions}</p>

      <div id="memory-game-board">
        {COLORS.map(color => (
          <div
            key={color}
            className="memory-pad"
            id={`pad-${color}`}
            style={{ backgroundColor: `var(--${color}-color)` }}
            onClick={() => handlePlayerInput(color)}
          ></div>
        ))}
      </div>

      <div id="memory-status" className="mt-3">
        <h4>Niveau: <span id="level-display">{level}</span></h4>
      </div>

      {result && (
        <div id="memory-result" className="mt-3">
          <h4 className={`text-${result.type}`}>{result.message}</h4>
        </div>
      )}

      {(!gameActive && !result) && (
        <button id="start-memory-btn" className="btn btn-primary mt-3" onClick={startGame}>Commencer</button>
      )}
      {result && (
        <button className="btn btn-primary mt-3" onClick={startGame}>Rejouer</button>
      )}
    </div>
  );
};

export default MemoryGame;
