import React from 'react';
import logo from '../pictures/logo.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Header from '../components/header/Header';
import Navi from '../components/header/Navi';

const App: React.FC = () => {
    return (
        <>
        <div>
        <Header/>
        <Navi/>

            {/* Additional components and application logic can be added here */}
        </div>
            <Routes>
                {<Route path="/" element={<Home />} />}
                {/* Lisää muita reittejä tarvittaessa */}
            </Routes>
        </>
    );
};

export default App;