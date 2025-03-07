import React from "react";
import { Outlet, Link } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>

      {/* Outlet näyttää oikean reitin sisällön */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
