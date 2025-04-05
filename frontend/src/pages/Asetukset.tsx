import asetukset from '../pictures/asetukset.png';
import React from 'react';

import ArvojenAsetus from '../components/asetukset/ArvojenAsetus';
import KayttajienAsetus from '../components/asetukset/KayttajienAsetus';
import CurrentState from '../components/currentState/CurrentState';
import Strategiat from '../components/asetukset/StrategiatAsetus';
import TeamProjectManager from '../components/organisation/TeamProjectManager';
import CreateUsers from '../components/asetukset/CreateUsers';

const Asetukset: React.FC = () => {

  return (
    <>
    <div>
      <h1>Welcome to the Settings!</h1>
    </div>
        <CreateUsers />
        <Strategiat />
        <KayttajienAsetus />
        <ArvojenAsetus />
        <CurrentState />
        <TeamProjectManager />
    </>
    )
 
};

export default Asetukset;





 