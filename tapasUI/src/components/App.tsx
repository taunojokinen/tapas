import React from 'react';
import logo from '../pictures/logo.png';

const App: React.FC = () => {
    return (
        <div>
            <h1>Welcome to My React App</h1>
            <img src={logo} alt="Logo" />
            {/* Additional components and application logic can be added here */}
        </div>
    );
};

export default App;