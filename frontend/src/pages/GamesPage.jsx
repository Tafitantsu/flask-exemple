import React from 'react';
import { Link } from 'react-router-dom';

const GamesPage = () => {
    return (
        <div>
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold">The Arcade Room</h1>
                <p className="lead">Choose a game and try to beat the high score!</p>
            </div>
            {/* Game cards will be added here */}
            <p>Game selection will be displayed here.</p>
            <Link to="/games/clicker">Play Clicker Game (temp link)</Link>
        </div>
    );
};

export default GamesPage;
