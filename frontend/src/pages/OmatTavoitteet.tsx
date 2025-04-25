import { useState } from "react";
import MyMission from "../components/omatTavoitteet/mymission"; // Adjust the path if necessary
import KeyObjectives from "../components/omatTavoitteet/keyObjectives"; // Adjust the path if necessary
import MyTasks from "../components/omatTavoitteet/myTasks"; // Adjust the path if necessary
import MyCurrentState from "../components/omatTavoitteet/myCurrenState"; // Adjust the path if necessary
import useAuth from "../hooks/useAuth"; // Import the custom hook
import { MyObjective, MyTask, MyObjectivesJson } from "../types/types";

const OmatTavoitteet = () => {
  const { username } = useAuth(); // Get the username from the custom hook

  // Combined state for all objectives data
  const [myObjectiveData, setMyObjectiveData] = useState<MyObjectivesJson>({
    user: username,
    title: "ohjelmointiharjoittelija",
    date: new Date().toISOString(), // Current date in ISO format
    mission:
      "Ohjelmistosuunnittelijan perustehtävä on suunnitella, kehittää ja ylläpitää korkealaatuisia ohjelmistoratkaisuja, jotka vastaavat asiakkaiden ja organisaation tarpeita. Tehtävä sisältää ohjelmistojen teknisen suunnittelun, koodauksen, testauksen ja dokumentoinnin sekä yhteistyön tiimin ja sidosryhmien kanssa tehokkaiden ja innovatiivisten ratkaisujen luomiseksi.",
    objectives: [
      { nimi: "Parantaa tiimityöskentelyä", mittari: "mittari", seuranta: "seuranta" },
      { nimi: "Pese sukat", mittari: "mittari", seuranta: "seuranta" },
      { nimi: "Imuroi lattiat", mittari: "mittari", seuranta: "seuranta" },
    ],
    tasks: [
      { nimi: "Tiskaa astiat", mittari: "mittari", seuranta: "seuranta" },
      { nimi: "Kehittää teknisiä taitoja", mittari: "mittari", seuranta: "seuranta" },
      { nimi: "Parantaa asiakaspalvelua", mittari: "mittari", seuranta: "seuranta" },
    ],
    hindrances: [""],
    promoters: [""],
  });

  // Handlers to update specific parts of the state
  const updateMission: React.Dispatch<React.SetStateAction<string>> = (newMission) => {
    setMyObjectiveData((prev) => ({ ...prev, mission: typeof newMission === "function" ? newMission(prev.mission) : newMission }));
  };

  const updateObjectives: React.Dispatch<React.SetStateAction<MyObjective[]>> = (newObjectives) => {
    setMyObjectiveData((prev) => ({
      ...prev,
      objectives: typeof newObjectives === "function" ? newObjectives(prev.objectives) : newObjectives,
    }));
  };

  const updateTasks: React.Dispatch<React.SetStateAction<MyTask[]>> = (newTasks) => {
    setMyObjectiveData((prev) => ({
      ...prev,
      tasks: typeof newTasks === "function" ? newTasks(prev.tasks) : newTasks,
    }));
  };

  const updateHindrances: React.Dispatch<React.SetStateAction<string[]>> = (newHindrances) => {
    setMyObjectiveData((prev) => ({
      ...prev,
      hindrances: typeof newHindrances === "function" ? newHindrances(prev.hindrances) : newHindrances,
    }));
  };

  const updatePromoters: React.Dispatch<React.SetStateAction<string[]>> = (newPromoters) => {
    setMyObjectiveData((prev) => ({
      ...prev,
      promoters: typeof newPromoters === "function" ? newPromoters(prev.promoters) : newPromoters,
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">
        Käyttäjän {myObjectiveData.user} joka on {myObjectiveData.title} Omat tavoitteet 
      </h2>
      <div className="flex flex-col space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <MyMission mission={myObjectiveData.mission} setMission={updateMission} />
          <KeyObjectives
            objectives={myObjectiveData.objectives}
            setObjectives={updateObjectives}
          />
          <MyTasks tasks={myObjectiveData.tasks} setTasks={updateTasks} />
          <MyCurrentState
            hindrances={myObjectiveData.hindrances}
            setHindrances={updateHindrances}
            promoters={myObjectiveData.promoters}
            setPromoters={updatePromoters}
          />
        </div>
      </div>
    </div>
  );
};

export default OmatTavoitteet;