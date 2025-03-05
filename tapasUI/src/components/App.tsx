import React from 'react';
import logo from '../pictures/logo.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';

const App: React.FC = () => {
    return (
        <>
        <div>
            <h1>Welcome to My React App</h1>
            <img src={logo} alt="Logo" />
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