import React from 'react';
import kata from '../pictures/Kata.png';

const Arvot: React.FC = () => {
    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Arvot Page!</p>
            <img src={kata} alt="Kaksi kataa" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>
    );
};

export default Arvot;