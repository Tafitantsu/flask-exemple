import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api';

const gameNames = {
  clicker: 'Clicker Fou',
  reflex: 'Jeu de Réflexe',
  typing: 'Dactylo Rapide'
};

const DashboardPage = () => {
  const [stats, setStats] = useState({ visit_count: 0, game_plays: 0 });
  const [highScores, setHighScores] = useState({});

  useEffect(() => {
    // Fetch global stats
    fetch(`${API_BASE_URL}/stats`)
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching stats:', error));

    // Fetch high scores
    fetch(`${API_BASE_URL}/game/highscores`)
      .then(response => response.json())
      .then(data => setHighScores(data))
      .catch(error => console.error('Error fetching high scores:', error));
  }, []);

  return (
    <div className="container fade-in">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Tableau de Bord</h1>
        <p className="lead">Statistiques globales du site et vos records personnels.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-eye fa-3x text-primary mb-3"></i>
              <h4 className="card-title">Visites Totales</h4>
              <p className="display-4 fw-bold">{stats.visit_count}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-gamepad fa-3x text-secondary mb-3"></i>
              <h4 className="card-title">Parties Jouées (Total)</h4>
              <p className="display-4 fw-bold">{stats.game_plays}</p>
              <small className="text-muted">(Cette fonctionnalité sera implémentée avec les jeux)</small>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-center mb-4">Vos Records Personnels</h2>
        <div className="card">
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {Object.keys(highScores).length > 0 ? (
                Object.entries(highScores).map(([game, score]) => (
                  <li key={game} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{gameNames[game] || game}</span>
                    <span className="badge bg-primary rounded-pill fs-6">{score}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-center">Vous n'avez pas encore de scores enregistrés. Allez jouer !</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;