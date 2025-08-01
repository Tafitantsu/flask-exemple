import React from 'react';
import { Link } from 'react-router-dom';

const GamesPage = () => {
  return (
    <div className="container fade-in">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Choisissez un jeu</h1>
        <p className="lead">Voici notre sélection de mini-jeux. D'autres seront ajoutés bientôt !</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card game-card">
            <div className="card-body text-center">
              <h5 className="card-title">Clicker Fou</h5>
              <p className="card-text">Testez votre vitesse de clic.</p>
              <Link to="/games/clicker" className="btn btn-primary">Jouer</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card game-card">
            <div className="card-body text-center">
              <h5 className="card-title">Jeu de Réflexe</h5>
              <p className="card-text">Testez la rapidité de vos réflexes.</p>
              <Link to="/games/reflex" className="btn btn-primary">Jouer</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card game-card">
            <div className="card-body text-center">
              <h5 className="card-title">Vitesse Cérébrale</h5>
              <p className="card-text">Mémorisez la séquence de couleurs.</p>
              <Link to="/games/memory" className="btn btn-primary">Jouer</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card game-card">
            <div className="card-body text-center">
              <h5 className="card-title">Mini Puzzle</h5>
              <p className="card-text">Trouvez toutes les paires d'icônes.</p>
              <Link to="/games/puzzle" className="btn btn-primary">Jouer</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card game-card">
            <div className="card-body text-center">
              <h5 className="card-title">Dactylo Rapide</h5>
              <p className="card-text">Tapez les mots le plus vite possible.</p>
              <Link to="/games/typing" className="btn btn-primary">Jouer</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
