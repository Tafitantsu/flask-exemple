import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from '@hooks/useAudio';

const COLORS = ['green', 'red', 'blue', 'yellow'];
const LIGHT_DURATION = 400;
const RESPONSE_TIME_LIMIT = 5000;

const MemoryGame = () => {
  // — États de jeu —
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [instructions, setInstructions] = useState("Prêt à démarrer ?");
  const [result, setResult] = useState(null);

  // — Flags pour l’UI —
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [responseTimeLeft, setResponseTimeLeft] = useState(RESPONSE_TIME_LIMIT);

  // — Sons —
  const { playClickSound, playSuccessSound } = useAudio();

  // — Réfs pour timers/intervals —
  const seqIntervalRef = useRef(null);
  const nextLevelTimeoutRef = useRef(null);
  const responseIntervalRef = useRef(null);

  // Allume brièvement la tuile
  const lightUpPad = useCallback((color) => {
    const pad = document.getElementById(`pad-${color}`);
    if (!pad) return;
    pad.classList.add('active');
    playClickSound();
    setTimeout(() => pad.classList.remove('active'), LIGHT_DURATION);
  }, [playClickSound]);

  // Lecture de la séquence
  const playSequence = useCallback(() => {
    setIsPlayingSequence(true);
    setInstructions("Regardez bien…");
    let i = 0;
    setSequenceProgress(0);

    seqIntervalRef.current = setInterval(() => {
      if (i >= sequence.length) {
        clearInterval(seqIntervalRef.current);
        setIsPlayingSequence(false);
        setInstructions("À vous !");
        setIsWaitingResponse(true);
        setResponseTimeLeft(RESPONSE_TIME_LIMIT);
        return;
      }
      lightUpPad(sequence[i]);
      i++;
      setSequenceProgress((i / sequence.length) * 100);
    }, 600);
  }, [sequence, lightUpPad]);

  // Fin de la partie
  const endGame = useCallback((win, message) => {
    // Arrêt de tous les timers
    clearInterval(seqIntervalRef.current);
    clearTimeout(nextLevelTimeoutRef.current);
    clearInterval(responseIntervalRef.current);

    const score = win ? level : Math.max(0, level - 1);
    setResult({
      message: message || (win ? `Bravo ! Score : ${score}` : `Perdu… Score : ${score}`),
      type: win ? 'success' : 'danger',
      score
    });
    setInstructions("Partie terminée");

    // Envoi du score
    if (score > 0) {
      fetch('http://localhost:8000/api/game/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'memory', score })
      }).catch(console.error);
    }
  }, [level]);

  // Passe au niveau suivant
  const nextLevel = useCallback(() => {
    setPlayerSequence([]);
    setLevel(l => l + 1);
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence(s => [...s, newColor]);
  }, []);

  // Au changement de niveau, on joue la séquence
  useEffect(() => {
    if (level > 0) {
      nextLevelTimeoutRef.current = setTimeout(playSequence, 500);
    }
  }, [level, playSequence]);

  // Timer de réponse
  useEffect(() => {
    if (!isWaitingResponse) return;
    responseIntervalRef.current = setInterval(() => {
      setResponseTimeLeft(rt => {
        if (rt <= 0) {
          clearInterval(responseIntervalRef.current);
          endGame(false, "Temps écoulé !");
          return 0;
        }
        return rt - 100;
      });
    }, 100);
    return () => clearInterval(responseIntervalRef.current);
  }, [isWaitingResponse, endGame]);

  // Démarrage/réinitialisation
  const startGame = () => {
    // Cleanup
    clearInterval(seqIntervalRef.current);
    clearTimeout(nextLevelTimeoutRef.current);
    clearInterval(responseIntervalRef.current);

    // Réinitialisation
    setSequence([]);
    setPlayerSequence([]);
    setLevel(0);
    setResult(null);
    setInstructions("Préparez-vous…");
    setIsPlayingSequence(false);
    setIsWaitingResponse(false);

    // On lance le premier niveau
    nextLevelTimeoutRef.current = setTimeout(nextLevel, 500);
  };

  // Gestion du clic joueur
  const handlePlayerInput = useCallback((color) => {
    if (!isWaitingResponse || result) return;
    lightUpPad(color);
    clearInterval(responseIntervalRef.current);

    const newSeq = [...playerSequence, color];
    setPlayerSequence(newSeq);

    // Mauvaise couleur
    if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
      return endGame(false);
    }

    // Séquence terminée correctement
    if (newSeq.length === sequence.length) {
      playSuccessSound();
      setIsWaitingResponse(false);

      if (level === 10) {
        return endGame(true);
      }
      // Nouveau niveau
      nextLevelTimeoutRef.current = setTimeout(nextLevel, 1000);
    }
  }, [isWaitingResponse, playerSequence, sequence, level, endGame, nextLevel, playSuccessSound, result]);

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(seqIntervalRef.current);
    clearTimeout(nextLevelTimeoutRef.current);
    clearInterval(responseIntervalRef.current);
  }, []);

  return (
    <div className="text-center">
      <h3>Vitesse Cérébrale</h3>
      <p className="text-muted">{instructions}</p>

      {/* Barre de progression */}
      {(isPlayingSequence || isWaitingResponse) && (
        <div className="progress-bar mb-3">
          <div
            className="progress-bar-inner"
            style={{
              width: `${isPlayingSequence ? sequenceProgress : (responseTimeLeft / RESPONSE_TIME_LIMIT) * 100}%`,
              backgroundColor: isPlayingSequence ? 'var(--primary-color)' : 'var(--danger-color)'
            }}
          />
        </div>
      )}

      {/* Plateau de jeu */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
        {COLORS.map(c => (
          <div
            key={c}
            id={`pad-${c}`}
            className="memory-pad"
            style={{
              backgroundColor: `var(--${c}-color)`,
              width: 100, height: 100, borderRadius: 10,
              cursor: isWaitingResponse ? 'pointer' : 'not-allowed',
              opacity: isWaitingResponse ? 1 : 0.5
            }}
            onClick={() => handlePlayerInput(c)}
          />
        ))}
      </div>

      <h4>Niveau : <span>{level}</span></h4>

      {result && <h4 className={`text-${result.type} mt-3`}>{result.message}</h4>}

      {!isPlayingSequence && !isWaitingResponse && (
        <button className="btn btn-primary mt-3" onClick={startGame}>
          {result ? 'Rejouer' : 'Commencer'}
        </button>
      )}
    </div>
  );
};

export default MemoryGame;
