// Header.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../pictures/logo.png";
import useAuth from "../../hooks/useAuth"; // Import the custom hook

const Header: React.FC = () => {
  const { token, username, error, handleLogin, handleLogout } = useAuth();
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(loginUsername, password);
  };

  return (
    <header className="w-full bg-gray-800 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 z-20 h-32">
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Company Logo" className="h-24" />
        <h1 className="text-4xl font-bold text-white">Tapas Johtamisavustin</h1>
        <h1 className="text-4xl font-bold text-white">Hello</h1>
      </div>

      {/* Conditional Rendering for Login/Logout/Change Password */}
      <div className="flex items-center space-x-4">
        {token && username && (
          <span className="text-white">Tervetuloa, {username}!</span>
        )}

        {!token ? (
          <form
            onSubmit={handleSubmitLogin}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Käyttäjänimi"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
              className="px-4 py-2 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Salasana"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Kirjaudu
            </button>
          </form>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Kirjaudu ulos
            </button>
            <Link
              to="/change-password"
              className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
            >
              Vaihda salasana
            </Link>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </header>
  );
};

export default Header;
