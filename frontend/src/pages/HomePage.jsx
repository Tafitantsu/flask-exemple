import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

const HomePage = () => {
  const { username, openUsernameModal } = useUser();
  const [stats, setStats] = useState({ visit_count: 0 });
  const [currentTime, setCurrentTime] = useState('');
  const [joke, setJoke] = useState('');

  useEffect(() => {
    // Increment visit count
    fetch('http://localhost:8000/api/visit', { method: 'POST' })
      .then(() => {
        // Fetch stats from the backend
        fetch('http://localhost:8000/api/stats') // Assuming the backend runs on port 8000
          .then(response => response.json())
          .then(data => setStats(data))
          .catch(error => console.error('Error fetching stats:', error));
      })
      .catch(error => console.error('Error incrementing visit count:', error));

    // Fetch a joke from the backend
    fetch('http://localhost:8000/api/joke')
      .then(response => response.json())
      .then(data => setJoke(data.joke))
      .catch(error => console.error('Error fetching joke:', error));

    // Set up a timer to update the current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('fr-FR'));
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container text-center fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card text-center p-4 mb-4" style={{ background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', color: 'white' }}>
            <div className="card-body">
              <h1 className="display-4 fw-bold">Bienvenue sur FunGames !</h1>
              <p className="lead">Votre nouvelle destination pour des mini-jeux amusants et addictifs.</p>
            </div>
          </div>

          {username ? (
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Salut, {username} !</h4>
              <p>Content de te revoir. Prêt à battre de nouveaux records ?</p>
              <hr />
              <Link to="/games" className="btn btn-primary">
                Aller aux jeux <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          ) : (
            <div className="alert alert-info" role="alert">
              <h4 className="alert-heading">Bienvenue, visiteur !</h4>
              <p>
                N'hésite pas à <a href="#" onClick={(e) => { e.preventDefault(); openUsernameModal(); }}>définir un pseudo</a> pour que nous puissions sauvegarder tes meilleurs scores !
              </p>
            </div>
          )}

          <div className="row mt-5">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <i className="fas fa-lightbulb"></i> La blague du jour
                </div>
                <div className="card-body d-flex flex-column justify-content-center">
                  <blockquote className="blockquote mb-0">
                    <p>{joke}</p>
                  </blockquote>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <i className="fas fa-chart-line"></i> Statistiques du site
                </div>
                <div className="card-body">
                  <p><strong>Date et heure :</strong> {currentTime}</p>
                  <p>
                    <strong>Nombre de visites :</strong>{' '}
                    <span className="badge bg-primary">{stats.visit_count}</span>
                  </p>
                  <Link to="/dashboard" className="btn btn-secondary mt-3">
                    Voir le dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
