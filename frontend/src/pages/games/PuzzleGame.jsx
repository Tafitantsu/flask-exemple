import React, { useState, useEffect, useCallback } from 'react';

const ICONS = [
  '<i class="fas fa-star"></i>',
  '<i class="fas fa-heart"></i>',
  '<i class="fas fa-bolt"></i>',
  '<i class="fas fa-leaf"></i>',
  '<i class="fas fa-gem"></i>',
  '<i class="fas fa-moon"></i>',
  '<i class="fas fa-sun"></i>',
  '<i class="fas fa-anchor"></i>',
];

const PuzzleGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [result, setResult] = useState(null);

  const initializeGame = useCallback(() => {
    const cardIcons = [...ICONS, ...ICONS];
    cardIcons.sort(() => 0.5 - Math.random());

    const initialCards = cardIcons.map((icon, index) => ({
      id: index,
      icon: icon,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameActive(true);
    setResult(null);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = useCallback((clickedCard) => {
    if (!gameActive || clickedCard.isFlipped || flippedCards.length >= 2) {
      return;
    }

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards((prev) => [...prev, clickedCard]);
  }, [gameActive, cards, flippedCards]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);
      const [card1, card2] = flippedCards;

      if (card1.icon === card2.icon) {
        // Match
        setMatchedPairs((prev) => prev + 1);
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === card1.id || card.id === card2.id
              ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
      } else {
        // No match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === card1.id || card.id === card2.id
                ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
        }, 1200);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedPairs === ICONS.length && gameActive) {
      setGameActive(false);
      const score = Math.max(1, 1000 - (moves * 10));
      setResult({
        message: `Félicitations ! Vous avez terminé en ${moves} mouvements.`, 
        type: 'success',
        score: score
      });

      // Send score to backend
      fetch('http://localhost:8000/api/game/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'puzzle', score: score }),
      })
        .then(response => response.json())
        .then(data => console.log('Puzzle score saved:', data))
        .catch(error => console.error('Error saving puzzle score:', error));
    }
  }, [matchedPairs, moves, gameActive]);

  return (
    <div id="puzzle-game" className="text-center">
      <h3 className="mb-3">Puzzle de Paires</h3>
      <p className="text-muted mb-4">Trouvez toutes les paires d'icônes identiques.</p>

      <div id="puzzle-board" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        maxWidth: '400px',
        margin: '20px auto',
        perspective: '1000px',
      }}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`puzzle-card ${card.isFlipped ? 'is-flipped' : ''} ${card.isMatched ? 'is-matched' : ''}`}
            onClick={() => handleCardClick(card)}
            style={{
              width: '90px',
              height: '90px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              cursor: 'pointer',
            }}
          >
            <div className="card-face card-front" style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2.5rem',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow)',
              background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
            }}></div>
            <div className="card-face card-back" style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2.5rem',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow)',
              backgroundColor: 'var(--card-bg)',
              transform: 'rotateY(180deg)',
              color: 'var(--primary-color)',
            }} dangerouslySetInnerHTML={{ __html: card.icon }}></div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <h4>Mouvements: <span id="moves-count">{moves}</span></h4>
      </div>

      {result && (
        <div id="puzzle-result" className="mt-3">
          <h4 className={`text-${result.type}`}>{result.message}</h4>
        </div>
      )}

      {!gameActive && (
        <button onClick={initializeGame} className="btn btn-primary mt-3">
          {result ? 'Rejouer' : 'Commencer'}
        </button>
      )}
    </div>
  );
};

export default PuzzleGame;
