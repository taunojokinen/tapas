// useAuth.ts
import { useState } from "react";

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [error, setError] = useState("");

  const handleLogin = async (username: string, password: string) => {
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
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username); // Store username in localStorage
      localStorage.setItem("role", data.role);
      setToken(data.token);
      setUsername(username);
      alert("Login successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      setToken("");
      setUsername("");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("Logout successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    token,
    username,
    error,
    handleLogin,
    handleLogout,
  };
};

export default useAuth;
