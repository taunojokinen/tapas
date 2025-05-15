import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ChangePassword from "./pages/ChangePassword";
import CompanyObjectives from "./pages/CompanyObjectives";
import Arvot from "./pages/Arvot";
import ChangeValues from "./components/arvot/ChangeValues";
import MyTeamObjectives from "./pages/MyTeamObjectives";
import OmatTavoitteet from "./pages/OmatTavoitteet";
import Tilannekuva from "./pages/Tilannekuva";
import Ideat from "./pages/Ideat";
import Aktiviteetit from "./pages/Aktiviteetit";
import Asetukset from "./pages/Asetukset";
import Header from "./components/header/Header";
import Navi from "./components/header/Navi";
import NotAuthorized from "./pages/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";

const App: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
    axios
      .get(apiUrl)
      .then((res) => setMessage(res.data))
      .catch((err) => console.error("Virhe:", err));
  }, []);
  const role = localStorage.getItem("role");
  console.log("User Role in Asetukset:", role);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-white">Hello</h1>
      <Header />

      {/* Main Content Section */}
      <div className="flex flex-grow">
        {/* Sidebar Navigation */}
        <Navi />

        {/* Main Content */}
        <div className="flex-grow bg-gray-100 text-gray-800 ml-64 mt-32 flex">
          <div className="bg-white shadow-md rounded-lg flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<CompanyObjectives />} />

              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/etusivu" element={<CompanyObjectives />} />
              <Route path="/arvot" element={<Arvot />} />
              <Route path="/change_values" element={<ChangeValues />} />
              <Route
                path="/my_team_objectives"
                element={<MyTeamObjectives />}
              />
              <Route path="/omat_tavoitteet" element={<OmatTavoitteet />} />
              <Route path="/tilannekuva" element={<Tilannekuva />} />
              <Route path="/ideat" element={<Ideat />} />
              <Route path="/aktiviteetit" element={<Aktiviteetit />} />
              <Route
                path="/asetukset"
                element={
                  <ProtectedRoute allowedRoles={["admin", "manager"]}>
                    <Asetukset />
                  </ProtectedRoute>
                }
              />
              <Route path="/not-authorized" element={<NotAuthorized />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
