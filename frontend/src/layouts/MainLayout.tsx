import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div>

      {/* Outlet näyttää oikean reitin sisällön */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
