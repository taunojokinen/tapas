import React from 'react';
import paamaara from '../pictures/paamaara.png';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Home Page!</p>
            <img src={paamaara} alt="Päämäärä" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>
    );
};

export default Home;