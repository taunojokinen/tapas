import React, { useState } from 'react';
import './Kirjautuminen.css';
import { Link } from 'react-router-dom';
// Adjust the import based on your project structure   
const Kirjautuminen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(''); // Token to track login state
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      setError(''); // Clear previous errors
  
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }
  
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token in localStorage
        setToken(data.token); // Save the token (you can store it in localStorage if needed)
        alert('Login successful!');
      } catch (err: any) {
        setError(err.message);
      }
    };
  
    const handleLogout = async () => {
        setError(''); // Clear previous errors

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }

            setToken(''); // Clear the token from state
            alert('Logout successful!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header Section */}
            <header className="flex justify-end items-center p-4 bg-white shadow-md">
                {token && (
                    <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-700">
                            Olet kirjautunut käyttäjänä: <span className="font-bold">{username}</span>
                        </p>
                        <Link
                            to="/change-password"
                            className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Vaihda salasana
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Kirjaudu ulos
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content Section */}
            <main className="flex items-center justify-center flex-grow">
                {!token ? (
                    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Kirjautuminen</h1>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Käyttäjänimi</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Salasana</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Kirjaudu
                            </button>
                        </form>
                        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default Kirjautuminen;