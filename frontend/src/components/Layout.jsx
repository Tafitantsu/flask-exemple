import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

const Layout = () => {
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
            </ul>
          </div>
        </div>
      </nav>

      {/* Audio Controls will be handled by a context provider */}

      {/* Main Content */}
      <main className="main-content">
        <div className="container py-4">
          <Outlet /> {/* Child routes will be rendered here */}
        </div>
      </main>

      {/* User Identification Modal will be handled by a context provider */}

      {/* Footer */}
      <footer className="footer mt-auto py-3">
        <div className="container text-center">
          <span>© 2024 FunGames - Tous droits réservés</span>
          {/* Username logic will be handled by UserProvider */}
          <div className="mt-2">
            {/* Placeholder for username display or login button */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
