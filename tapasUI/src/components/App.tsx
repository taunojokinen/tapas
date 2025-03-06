import React from 'react';
import logo from '../pictures/logo.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Kirjautuminen from '../pages/Kirjautuminen';
import Home from '../pages/Home';
import Tavoitteet from '../pages/Tavoitteet';
import Tilannekuva from '../pages/Tilannekuva';
import Header from '../components/header/Header';
import Navi from '../components/header/Navi';


const App: React.FC = () => {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Header/>
            <div style={{ display: 'flex', flex: 1 }}>
                <Navi/>
            <div style={{ marginLeft: '2em', padding: '20em', width: '100%' }}>
                <Routes>
                    {<Route path="/" element={<Kirjautuminen />} />}
                    {<Route path="/etusivu" element={<Home />} />}
                    {<Route path="/tavoitteet" element={<Tavoitteet />} />}
                    {<Route path="/tilannekuva" element={<Tilannekuva />} />}
                    {/* Lisää muita reittejä tarvittaessa */}
                </Routes>
                </div>
            </div>
            </div>
        </>
    );
};

export default App;