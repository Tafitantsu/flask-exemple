import React, { useState, useEffect, useRef, useCallback } from 'react';
import ApiCall from '@utils/ApiCall';

const GAME_DURATION = 30; // seconds
const WORDS = [
  'python', 'flask', 'javascript', 'html', 'css', 'bootstrap', 'docker', 'github', 'coding', 'developer', 'interface', 'responsive', 'animation', 'moderne', 'projet', 'amusant'
];

const TypingGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [gameActive, setGameActive] = useState(false);
  const [result, setResult] = useState(null);

  const timerIntervalRef = useRef(null);
  const inputRef = useRef(null);
  const scoreRef = useRef(score);

    useEffect(() => {
      scoreRef.current = score;
    }, [score]);

  const showNewWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setCurrentWord(WORDS[randomIndex]);
  }, []);
    const endGame = useCallback(() => {
    const FinalScore = scoreRef.current;
    setGameActive(false);
    clearInterval(timerIntervalRef.current);
    setResult({
      message: `Votre score final est de ${FinalScore} mots.`, 
      type: 'success',
      score: FinalScore
    });

    // Send score to backend
    ApiCall('/game/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'typing', score: FinalScore }),
    })
      .then(data => console.log('Typing score saved:', data))
      .catch(error => console.error('Error saving typing score:', error));

  }, []); // Add score to dependency array

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setInputValue('');
    setResult(null);
    setGameActive(true);
    showNewWord();
    if (inputRef.current) {
      inputRef.current.focus();
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime - 1 <= 0) {
          clearInterval(timerIntervalRef.current);
          endGame(); // Call endGame without argument
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [showNewWord, endGame]); // endGame is now a dependency

  const handleInputChange = (e) => {
    if (!gameActive) return;

    const value = e.target.value;
    setInputValue(value);

    if (value.toLowerCase() === currentWord) {
      setScore(prevScore => prevScore + 1);
      setInputValue('');
      showNewWord();
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return (
    <div id="typing-game" className="text-center">
      <h3 className="mb-3">Dactylo Rapide</h3>
      <p className="text-muted mb-4">Tapez le mot affiché aussi vite que possible. Vous avez {GAME_DURATION} secondes !</p>

      <div className="row justify-content-center mb-4">
        <div className="col-md-4">
          <h4>Temps restant</h4>
          <p id="typing-timer" className="fs-3 fw-bold">{timeLeft}s</p>
        </div>
        <div className="col-md-4">
          <h4>Score</h4>
          <p id="typing-score" className="fs-3 fw-bold">{score}</p>
        </div>
      </div>

      <div id="word-display" className="mb-4">
        {gameActive ? currentWord : 'Prêt ?'}
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            id="typing-input"
            className="form-control form-control-lg"
            placeholder="Commencez à taper ici..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            disabled={!gameActive}
            value={inputValue}
            onChange={handleInputChange}
            ref={inputRef}
          />
        </div>
      </div>

      {result && (
        <div id="typing-result" className="mt-4">
          <h4 className={`text-${result.type}`}>{result.message}</h4>
        </div>
      )}

      {(!gameActive || result) && (
        <button onClick={startGame} className="btn btn-primary mt-3">
          {result ? 'Rejouer' : 'Commencer'}
        </button>
      )}
    </div>
  );
};

export default TypingGame;