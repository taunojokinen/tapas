import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
//import './media.css';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/context/UserContext";

/**
 * Main component of the application.
 */

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
