import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string;
  username: string;
  role: string;
  error: string;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const handleLogin = async (username: string, password: string) => {
    setError("");

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await response.json();
      setToken(data.token);
      setUsername(username);
      setRole(data.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", data.role);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    setError("");

    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setToken("");
      setUsername("");
      setRole("");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ token, username, role, error, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
