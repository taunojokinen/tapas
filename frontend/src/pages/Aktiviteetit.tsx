import React from 'react';
import seuranta from '../pictures/seuranta.png';

const Aktiviteetit: React.FC = () => {
    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Aktiviteetit Page!</p>
            <img src={seuranta} alt="Liikennevalot" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>
    );
};

export default Aktiviteetit;