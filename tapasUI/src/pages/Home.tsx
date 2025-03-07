import React from 'react';
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <div>
            <h1>Tapas</h1>
            <h3>Johtamisavustin</h3>
            <p>Welcome to the Home Page!</p>
            <Link to="/dashboard">Go to Dashboard</Link>
        </div>
    );
};

export default Home;