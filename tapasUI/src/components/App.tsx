import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Kirjautuminen from '../pages/Kirjautuminen';
import Home from '../pages/Home';
import Tavoitteet from '../pages/Tavoitteet';
import Tilannekuva from '../pages/Tilannekuva';
import Ideat from '../pages/Ideat';
import Aktiviteetit from '../pages/Aktiviteetit';
import Asetukset from '../pages/Asetukset';
import Header from '../components/header/Header';
import Navi from '../components/header/Navi';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import logo from '../pictures/logo.png';

import UserForm from '../pages/UserForm';
import Dashboard from '../pages/Dashboard';
import MainLayout from '../layouts/MainLayout';


const App: React.FC = () => {

    const [message, setMessage] = useState("");
    useEffect(() => {
        axios.get("http://localhost:5000")
          .then(res => setMessage(res.data))
          .catch(err => console.error("Virhe:", err));
      }, []);
    
    return (
        <>
        <div>
             
            <h1>Welcome to My React App</h1>
            <img src={logo} alt="Logo" />
            {/* Additional components and application logic can be added here */}
        </div>
            <Routes>
                {/* Yleisille sivuille käytetään MainLayoutia */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>

                {/* Dashboardille EI käytetä layoutia, jotta se näkyy yksin */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        
         
       </>
    );
};

export default App;