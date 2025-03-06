import React from 'react';
import asetukset from '../pictures/asetukset.png';

const Asetukset: React.FC = () => {
    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Asetukset Page!</p>
            <img src={asetukset} alt="ratas" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>
    );
};

export default Asetukset;