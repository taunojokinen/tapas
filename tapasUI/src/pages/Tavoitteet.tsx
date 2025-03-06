import React from 'react';
import hoshin from '../pictures/hoshin.png';

const Tavoitteet: React.FC = () => {
    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Tavoite Page!</p>
            <img src={hoshin} alt="Hoshin-taulu" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>
    );
};

export default Tavoitteet;