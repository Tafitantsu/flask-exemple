import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const [stats, setStats] = useState({ visit_count: 0, game_plays: 0 });

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/stats')
            .then(response => {
                setStats(response.data);
            })
            .catch(error => {
                console.error("Error fetching stats:", error);
            });
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Site Statistics</h5>
                    <p>Total Visits: {stats.visit_count}</p>
                    <p>Total Games Played: {stats.game_plays}</p>
                </div>
            </div>
            <div className="card mt-4">
                <div className="card-body">
                    <h5 className="card-title">Your High Scores</h5>
                    {/* High scores will be displayed here from context */}
                    <p>High score display coming soon!</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
