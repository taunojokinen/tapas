import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Kirjautuminen from '../pages/Kirjautuminen';
import Home from '../pages/Home';
import Arvot from '../pages/Arvot';
import ChangeValues from "./arvot/ChangeValues";

import Tavoitteet from '../pages/Tavoitteet';
import Tilannekuva from '../pages/Tilannekuva';
import Ideat from '../pages/Ideat';
import Aktiviteetit from '../pages/Aktiviteetit';
import Asetukset from '../pages/Asetukset';
import Header from './header/Header';
import Navi from './header/Navi';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import logo from '../pictures/logo.png';

import UserForm from '../pages/UserForm';
import MainLayout from '../layouts/MainLayout';



const App: React.FC = () => {

    const [message, setMessage] = useState("");
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}`)
          .then(res => setMessage(res.data))
          .catch(err => console.error("Virhe:", err));
      }, []);
    
      return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Header/>
            <div style={{ display: 'flex', flex: 1 }}>
                <Navi/>
            <div style={{ marginLeft: '2em', padding: '20em', width: '100%' }}>
                <Routes>
                    <Route element={<MainLayout />}>
                     {<Route path="/" element={<Kirjautuminen />} />}
                    {<Route path="/etusivu" element={<Home />} />}
                    {<Route path="/arvot" element={<Arvot />} />}
                    {<Route path="/change_values" element={<ChangeValues />} />}
                    {<Route path="/userform" element={<UserForm />} />}
                    </Route>
                    {<Route path="/tavoitteet" element={<Tavoitteet />} />}
                    {<Route path="/tilannekuva" element={<Tilannekuva />} />}
                    {<Route path="/ideat" element={<Ideat />} />}
                    {<Route path="/aktiviteetit" element={<Aktiviteetit />} />} 
                    {<Route path="/asetukset" element={<Asetukset />} />}

                </Routes>
                </div>
            </div>
            </div>
        </>
    );
};


export default App;