import React from 'react';
import kata from '../pictures/Kata.png';

const Ideat: React.FC = () => {
    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Ideat Page!</p>
            <img src={kata} alt="Kaksi kataa" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>
    );
};

export default Ideat;