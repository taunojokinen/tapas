import React from 'react';
import tilannekuva from '../pictures/tilannekuva.png';

const Tilannekuva: React.FC = () => {
    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Tilannekuva Page!</p>
            <img src={tilannekuva} alt="Hoshin-taulu" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        
        </div>
    );
};

export default Tilannekuva;