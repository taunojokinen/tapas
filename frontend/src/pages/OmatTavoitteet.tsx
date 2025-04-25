import { useEffect, useState } from "react";
import MyMission from "../components/omatTavoitteet/mymission"; // Adjust the path if necessary
import KeyObjectives from "../components/omatTavoitteet/keyObjectives"; // Adjust the path if necessary
import MyTasks from "../components/omatTavoitteet/myTasks"; // Adjust the path if necessary
import MyCurrentState from "../components/omatTavoitteet/myCurrenState"; // Adjust the path if necessary
import useAuth from "../hooks/useAuth"; // Import the custom hook
import { MyObjective, MyTask, MyObjectivesJson } from "../types/types";
import { fetchMyObjectiveData } from "../components/omatTavoitteet/myObjectiveFunctions";
import { postMyObjectiveData } from "../components/omatTavoitteet/myObjectiveFunctions";

const OmatTavoitteet = () => {
  const { username } = useAuth(); // Get the username from the custom hook

  // State for dynamically fetched data
  const [myObjectiveData, setMyObjectiveData] = useState<MyObjectivesJson | null>(null);

  // Fetch data from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMyObjectiveData();
      if (data) {
        // Ensure the username is set in the fetched data
        setMyObjectiveData({ ...data, user: username });
      }
    };

    fetchData();
  }, [username]); // Add username as a dependency to ensure it updates if it changes

  // Show a loading message while data is being fetched
  if (!myObjectiveData) {
    return <p>Loading...</p>;
  }

  // Handlers to update specific parts of the state
  const updateMission: React.Dispatch<React.SetStateAction<string>> = (newMission) => {
    setMyObjectiveData((prev) =>
      prev ? { ...prev, mission: typeof newMission === "function" ? newMission(prev.mission) : newMission } : null
    );
  };

  const updateObjectives: React.Dispatch<React.SetStateAction<MyObjective[]>> = (newObjectives) => {
    setMyObjectiveData((prev) =>
      prev ? { ...prev, objectives: typeof newObjectives === "function" ? newObjectives(prev.objectives) : newObjectives } : null
    );
  };

  const updateTasks: React.Dispatch<React.SetStateAction<MyTask[]>> = (newTasks) => {
    setMyObjectiveData((prev) =>
      prev ? { ...prev, tasks: typeof newTasks === "function" ? newTasks(prev.tasks) : newTasks } : null
    );
  };

  const updateHindrances: React.Dispatch<React.SetStateAction<string[]>> = (newHindrances) => {
    setMyObjectiveData((prev) =>
      prev ? { ...prev, hindrances: typeof newHindrances === "function" ? newHindrances(prev.hindrances) : newHindrances } : null
    );
  };

  const updatePromoters: React.Dispatch<React.SetStateAction<string[]>> = (newPromoters) => {
    setMyObjectiveData((prev) =>
      prev ? { ...prev, promoters: typeof newPromoters === "function" ? newPromoters(prev.promoters) : newPromoters } : null
    );
  };

  const handleSave = async () => {
    if (myObjectiveData) {
      const success = await postMyObjectiveData(myObjectiveData);
      if (success) {
        alert("Data successfully saved!");
      } else {
        alert("Failed to save data.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">
        Käyttäjän {myObjectiveData.user} joka on {myObjectiveData.title} Omat tavoitteet
      </h2>
      <div className="flex flex-col space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <MyMission mission={myObjectiveData.mission} setMission={updateMission} />
          <KeyObjectives objectives={myObjectiveData.objectives} setObjectives={updateObjectives} />
          <MyTasks tasks={myObjectiveData.tasks} setTasks={updateTasks} />
          <MyCurrentState
            hindrances={myObjectiveData.hindrances}
            setHindrances={updateHindrances}
            promoters={myObjectiveData.promoters}
            setPromoters={updatePromoters}
          />
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};


export default OmatTavoitteet;