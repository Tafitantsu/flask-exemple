import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [joke, setJoke] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/joke')
            .then(response => {
                setJoke(response.data.joke);
            })
            .catch(error => {
                console.error("Error fetching joke:", error);
                setJoke("Couldn't fetch a joke, but you're still awesome!");
            });
    }, []);

    return (
        <div className="text-center">
            <h1>Welcome to FunGames!</h1>
            <p className="lead">Your one-stop place for fun browser games.</p>
            <div className="card my-4">
                <div className="card-body">
                    <h5 className="card-title">Developer Joke of the Day</h5>
                    <p className="card-text fst-italic">"{joke}"</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
