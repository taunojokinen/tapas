import React from 'react';
import { Link } from 'react-router-dom';
import './Navi.css';
//import { useLoginData } from '../../context/LoginDataContext';

/**
 * Navi component for the navigation bar.
 * @returns {Element}
 */


const Navi = () => {
 /* const loginData = useLoginData();
  
  const handleLogout = () => {
    localStorage.removeItem('loginData');
    loginData.setUserName('');
    loginData.setToken('');
    //console.log(loginData);
  }*/

  return (
      <div id="colorbar">
        <div id="navi_bar">
          <ul className="navi">
            <li><Link to="/">Kirjaudu</Link></li>
            <li><Link to="/etusivu">Etusivu</Link></li>
            <li><Link to="/arvot">Arvot</Link></li>
            <li><Link to="/tavoitteet">Tavoitteet</Link></li>
            <li><Link to="/tilannekuva">Tilannekuva</Link></li>
            <li><Link to="/ideat">Ideat</Link></li>
            <li><Link to="/aktiviteetit">Aktiviteetit</Link></li>
            <li><Link to="/asetukset">Asetukset</Link></li>
{/*             {!loginData.userName && <li><Link to="/login">Kirjautuminen</Link></li>}
            {loginData.userName && <li><Link to="/myaccount">Oma tili</Link></li>}
            {loginData.userName && <li><Link onClick={handleLogout}>Kirjaudu ulos</Link></li>} */}
          </ul>
        </div>
      </div>
  );
};

export default Navi;