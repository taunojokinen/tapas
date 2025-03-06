import React from 'react';
import logo from '../pictures/logo.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
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
                    {<Route path="/" element={<Home />} />}
                    {/* Lisää muita reittejä tarvittaessa */}
                </Routes>
                </div>
            </div>
            </div>
        </>
    );
};

export default App;