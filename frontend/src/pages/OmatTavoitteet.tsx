import React, { useState } from "react";
import MyMission from "../components/omatTavoitteet/mymission"; // Adjust the path if necessary
import KeyObjectives from "../components/omatTavoitteet/keyObjectives"; // Adjust the path if necessary
import MyTasks from "../components/omatTavoitteet/myTasks"; // Adjust the path if necessary
import MyCurrentState from "../components/omatTavoitteet/myCurrenState"; // Adjust the path if necessary
import { testifunktio } from "../components/omatTavoitteet/myFunctions"; // Adjust the path if necessary


  const OmatTavoitteet = () => {
    const [username] = useState("tauno"); // Käyttäjänimi
    const [mission, setMission] = useState(
        "Ohjelmistosuunnittelijan perustehtävä on suunnitella, kehittää ja ylläpitää korkealaatuisia ohjelmistoratkaisuja, jotka vastaavat asiakkaiden ja organisaation tarpeita. Tehtävä sisältää ohjelmistojen teknisen suunnittelun, koodauksen, testauksen ja dokumentoinnin sekä yhteistyön tiimin ja sidosryhmien kanssa tehokkaiden ja innovatiivisten ratkaisujen luomiseksi."
      );
    const [avaintavoitteet, setAvaintavoitteet] = useState<string[]>([]);
    const [tehtavat, setTehtavat] = useState<string[]>([]);
    const [nykytila, setNykytila] = useState({
      hindrances: [],
      promoters: [],
    });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">Omat tavoitteet</h2>
      <div className="flex flex-col space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
        <MyMission mission={mission} setMission={setMission} />
          <KeyObjectives />
          <MyTasks />
          <MyCurrentState />


        </div>
      </div>
    </div>
  )
}

export default OmatTavoitteet;