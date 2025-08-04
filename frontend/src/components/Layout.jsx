import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const Layout = () => {
  const { username, isModalOpen, openUsernameModal, closeUsernameModal, setUsername, clearUsername } = useUser();
  const [inputUsername, setInputUsername] = useState('');

  const handleSetUsername = () => {
    setUsername(inputUsername);
    setInputUsername(''); // Clear input after setting
  };

  const handleClearUsername = () => {
    clearUsername();
    closeUsernameModal();
  };

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-gamepad"></i> FunGames
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  <i className="fas fa-home"></i> Accueil
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/games">
                  <i className="fas fa-gamepad"></i> Jeux
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  <i className="fas fa-info-circle"></i> À propos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  <i className="fas fa-envelope"></i> Contact
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                  <i className="fas fa-chart-bar"></i> Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={openUsernameModal} style={{ color: 'white' }}>
                  <i className="fas fa-user"></i> {username ? username : 'Définir un pseudo'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container py-4">
          <Outlet /> {/* Child routes will be rendered here */}
        </div>
      </main>

      {/* Username Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{username ? 'Modifier votre pseudo' : 'Définir votre pseudo'}</h5>
                <button type="button" className="btn-close" onClick={closeUsernameModal}></button>
              </div>
              <div className="modal-body">
                {username && <p>Votre pseudo actuel : <strong>{username}</strong></p>}
                <div className="mb-3">
                  <label htmlFor="usernameInput" className="form-label">Nouveau pseudo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="usernameInput"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="Entrez votre pseudo"
                  />
                </div>
              </div>
              <div className="modal-footer">
                {username && (
                  <button type="button" className="btn btn-danger" onClick={handleClearUsername}>
                    Supprimer le pseudo
                  </button>
                )}
                <button type="button" className="btn btn-secondary" onClick={closeUsernameModal}>
                  Annuler
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSetUsername}>
                  {username ? 'Modifier' : 'Définir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer mt-auto py-3">
        <div className="container text-center">
          <span>© 2025 FunGames - Tous droits réservés</span>
          <div className="mt-2">
            <p>Connecté en tant que: <strong>{username || 'Visiteur'}</strong></p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;