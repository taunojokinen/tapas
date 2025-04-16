import React from "react";
import CurrentStateSummary from "../components/currentState/CurrentStateSummary";
import StrategiatSummary from "../components/asetukset/StrategiatSummary";

const perustehtava =
  "Tarjoamme asiakkaillemme korkealaatuisia ohjelmistokehityspalveluita, jotka auttavat heitä saavuttamaan liiketoiminnalliset tavoitteensa tehokkaasti ja laadukkaasti.";
const nykytila = [
  "Asiakaspalaute on pääosin positiivista ja tuotteemme on helppokäyttöinen.",
  "Kuitenkin tuotteemme on teknisesti vanhentunut ja kilpailijat ovat kehittäneet vastaavia tuotteita, jotka ovat teknisesti edistyksellisempiä.",
];
const visio =
  "Olemme Suomen johtava ohjelmistokehityspalveluiden tarjoaja vuoteen 2030 mennessä.";

const YrityksenTavoitteet: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">Yrityksen tavoitteet</h2>
      <div className="flex flex-col space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Perustehtävä</h2>
          <p>{perustehtava}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Päämäärä</h2>
          <p>{visio}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <StrategiatSummary />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <CurrentStateSummary />
        </div>
      </div>
    </div>
  );
};

export default YrityksenTavoitteet;
