import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//import './media.css';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/context/UserContext";
import { AuthProvider } from "../src/components/context/AuthContext";

/**
 * Main component of the application.
 */

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
