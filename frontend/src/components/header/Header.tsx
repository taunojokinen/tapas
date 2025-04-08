import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../pictures/logo.png";

const Header: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize token from localStorage

  const handleLogin = async (e: React.FormEvent) => {
    console.log("Login button clicked");
    e.preventDefault();

    setError(""); // Clear previous errors

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login Response:", data); // Debug the response
      localStorage.setItem("token", data.token); // Store the token in localStorage
      localStorage.setItem("role", data.role); // Store the user's role in localStorage
      setToken(data.token); // Save the token in state
      alert("Login successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    setError(""); // Clear previous errors

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      setToken(""); // Clear the token from state
      localStorage.removeItem("token"); // Remove the token from localStorage
      alert("Logout successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <header className="w-full bg-gray-800 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 z-20 h-32">
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Company Logo" className="h-24" />
        <h1 className="text-4xl font-bold text-white">Tapas Johtamisavustin</h1>
      </div>

      {/* Conditional Rendering for Login/Logout/Change Password */}
      <div className="flex items-center space-x-4">
        {!token ? (
          // Login Form
          <form onSubmit={handleLogin} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Käyttäjänimi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          // Logout and Change Password Buttons
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

      {/* Error Message */}
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </header>
  );
};

export default Header;
