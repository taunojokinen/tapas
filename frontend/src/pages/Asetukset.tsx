import React from "react";
import TeamProjectManager from "../components/organisation/TeamProjectManager";
import CreateUsers from "../components/asetukset/CreateUsers";

const Asetukset: React.FC = () => {
  return (
    <>
      <div>
        <h1>Welcome to the Settings!</h1>
      </div>
      <CreateUsers />
      <TeamProjectManager />
    </>
  );
};

export default Asetukset;
