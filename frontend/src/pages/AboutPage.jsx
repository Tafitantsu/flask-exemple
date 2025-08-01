import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header text-center">
              <h1 className="display-6">À Propos de FunGames</h1>
            </div>
            <div className="card-body p-4">
              <p className="lead">FunGames est une plateforme de mini-jeux conçue pour offrir une expérience de jeu rapide, amusante et engageante directement dans votre navigateur.</p>
              
              <h4 className="mt-4">Notre Mission</h4>
              <p>Notre objectif est de créer un espace de divertissement simple et accessible à tous. Pas de téléchargement, pas d'inscription compliquée, juste du fun instantané. Nous croyons au pouvoir des jeux pour apporter de la joie et de la compétition amicale.</p>

              <h4 className="mt-4">Technologies Utilisées</h4>
              <p>Ce projet a été développé avec une stack web moderne et performante :</p>
              <ul>
                <li><strong>Backend :</strong> <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer">FastAPI (Python)</a> pour sa haute performance et sa facilité d'utilisation.</li>
                <li><strong>Frontend :</strong> <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> avec <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">Vite</a> pour une expérience de développement rapide et un rendu efficace.</li>
                <li><strong>Framework CSS :</strong> <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer">Bootstrap 5</a> pour un design responsive et élégant.</li>
                <li><strong>Icônes :</strong> <a href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer">FontAwesome</a> pour l'aspect visuel.</li>
                <li><strong>Routage :</strong> <a href="https://reactrouter.com/" target="_blank" rel="noopener noreferrer">React Router</a> pour la navigation côté client.</li>
              </ul>

              <div className="text-center mt-4">
                <Link to="/games" className="btn btn-primary">Jouer maintenant !</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
