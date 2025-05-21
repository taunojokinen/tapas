import React from "react";
import TekstikenttaOsio from "../components/tavoitteet/TekstikenttaOsio";
import AvainstrategiaRivit from "../components/tavoitteet/AvainstrategiaRivit";
import { useCompanyObjectives } from "../hooks/useCompanyObjectives";

const CompanyObjectives: React.FC = () => {
  const {
    perustehtava,
    setPerustehtava,
    paamaara,
    setPaamaara,
    avainstrategiat,
    setAvainstrategiat,
    pros,
    setPros,
    cons,
    setCons,
    viesti,
    tallennaTiedot,
  } = useCompanyObjectives();
  console.log("avainstrategiat: ", avainstrategiat)
  const userRole = localStorage.getItem("role");
  const isAuthorized = userRole === "admin" || userRole === "manager";

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white shadow rounded md:p-8">
        <h1 className="text-3xl font-bold mb-8">Yrityksen tavoitteet</h1>

        <TekstikenttaOsio
          otsikko="Perustehtävä"
          rivit={perustehtava}
          paivita={setPerustehtava}
          isAuthorized={isAuthorized}
        />

        <TekstikenttaOsio
          otsikko="Päämäärä"
          rivit={paamaara}
          paivita={setPaamaara}
          isAuthorized={isAuthorized}
        />

        <AvainstrategiaRivit
          strategiat={avainstrategiat}
          paivita={setAvainstrategiat}
          isAuthorized={isAuthorized}
        />

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Nykytila</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TekstikenttaOsio
              otsikko="Pros"
              rivit={pros}
              paivita={setPros}
              isAuthorized={isAuthorized}
            />
            <TekstikenttaOsio
              otsikko="Cons"
              rivit={cons}
              paivita={setCons}
              isAuthorized={isAuthorized}
            />
          </div>
        </div>

        {isAuthorized && (
          <button
            onClick={tallennaTiedot}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tallenna
          </button>
        )}

        {viesti && <p className="mt-4 text-sm text-gray-700">{viesti}</p>}
      </div>
    </div>
  );
};

export default CompanyObjectives;
