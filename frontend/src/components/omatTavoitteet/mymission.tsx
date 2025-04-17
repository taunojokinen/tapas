import React, { useState } from "react";

const MyMission: React.FC = () => {
  const [mission, setMission] = useState(
    "Ohjelmistosuunnittelijan perustehtävä on suunnitella, kehittää ja ylläpitää korkealaatuisia ohjelmistoratkaisuja, jotka vastaavat asiakkaiden ja organisaation tarpeita. Tehtävä sisältää ohjelmistojen teknisen suunnittelun, koodauksen, testauksen ja dokumentoinnin sekä yhteistyön tiimin ja sidosryhmien kanssa tehokkaiden ja innovatiivisten ratkaisujen luomiseksi."
  );

  const handleMissionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMission(event.target.value);
  };

  const handleSaveMission = () => {
    alert("Perustehtävä tallennettu: " + mission);
    // Voit lisätä tallennuslogiikan, esim. lähettää tiedot backendille
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Muokkaa perustehtävää</h2>
      <textarea
        value={mission}
        onChange={handleMissionChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        rows={6}
      />
      {/* <button
        onClick={handleSaveMission}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tallenna perustehtävä
      </button> */}
    </div>
  );
};

export default MyMission;