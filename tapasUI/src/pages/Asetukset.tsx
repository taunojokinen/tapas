import asetukset from '../pictures/asetukset.png';
import React from 'react';

import ArvojenAsetus from './asetukset/ArvojenAsetus';
import KayttajienAsetus from './asetukset/KayttajienAsetus';
import CurrentState from '../components/currentState/CurrentState';

const Asetukset: React.FC = () => {

  return (
    <>
    <div>
      <h1>Welcome to the Settings!</h1>
    </div>
        <KayttajienAsetus />
        <ArvojenAsetus />
        <CurrentState />
    </>
    )
 
};

export default Asetukset;





 