import { useEffect, useState } from "react";
import MyCoach from "../components/omatTavoitteet/myCoach";
import MyMission from "../components/omatTavoitteet/myMission"; // Adjust the path if necessary
import KeyObjectives from "../components/omatTavoitteet/keyObjectives"; // Adjust the path if necessary
import MyTasks from "../components/omatTavoitteet/myTasks"; // Adjust the path if necessary
import MyCurrentState from "../components/omatTavoitteet/myCurrenState"; // Adjust the path if necessary
import useAuth from "../hooks/useAuth"; // Import the custom hook
import { MyObjective, MyTask, MyObjectivesJson } from "../types/types";
import {
  fetchMyObjectiveData,
  patchMyObjectiveData,
} from "../components/omatTavoitteet/myObjectiveFunctions";

const OmatTavoitteet = () => {
  const { username } = useAuth(); // Get the username from the custom hook
  const [myObjectiveData, setMyObjectiveData] =
    useState<MyObjectivesJson | null>(null);
  const [viewMode, setViewMode] = useState<string>("show all");

  // Fetch data from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        const data = await fetchMyObjectiveData(username); // Pass username here
        if (data) {
          setMyObjectiveData(data);
        }
      }
    };

    fetchData();
  }, [username]); // Add username as a dependency to ensure it updates if it changes

  // Show a loading message while data is being fetched
  if (!myObjectiveData) {
    return <p>Loading...</p>;
  }

  // Handlers to update specific parts of the state
  const updateMission: React.Dispatch<React.SetStateAction<string>> = (
    newMission
  ) => {
    setMyObjectiveData((prev) =>
      prev
        ? {
            ...prev,
            mission:
              typeof newMission === "function"
                ? newMission(prev.mission)
                : newMission,
          }
        : null
    );
  };

  const updateObjectives: React.Dispatch<
    React.SetStateAction<MyObjective[]>
  > = (newObjectives) => {
    setMyObjectiveData((prev) =>
      prev
        ? {
            ...prev,
            objectives:
              typeof newObjectives === "function"
                ? newObjectives(prev.objectives)
                : newObjectives,
          }
        : null
    );
  };

  const updateTasks: React.Dispatch<React.SetStateAction<MyTask[]>> = (
    newTasks
  ) => {
    setMyObjectiveData((prev) =>
      prev
        ? {
            ...prev,
            tasks:
              typeof newTasks === "function" ? newTasks(prev.tasks) : newTasks,
          }
        : null
    );
  };

  const updateHindrances: React.Dispatch<React.SetStateAction<string[]>> = (
    newHindrances
  ) => {
    setMyObjectiveData((prev) =>
      prev
        ? {
            ...prev,
            hindrances:
              typeof newHindrances === "function"
                ? newHindrances(prev.hindrances)
                : newHindrances,
          }
        : null
    );
  };

  const updatePromoters: React.Dispatch<React.SetStateAction<string[]>> = (
    newPromoters
  ) => {
    setMyObjectiveData((prev) =>
      prev
        ? {
            ...prev,
            promoters:
              typeof newPromoters === "function"
                ? newPromoters(prev.promoters)
                : newPromoters,
          }
        : null
    );
  };

  // Helper to determine which sections to show
  const showCoach = true;
  const showMission =
    viewMode === "show all" ||
    viewMode === "myMission" ||
    viewMode === "keyObjectives" ||
    viewMode === "myTasks" ||
    viewMode === "myCurrentState";
  const showObjectives =
    viewMode === "show all" ||
    viewMode === "keyObjectives" ||
    viewMode === "myTasks" ||
    viewMode === "myCurrentState";
  const showTasks =
    viewMode === "show all" ||
    viewMode === "myTasks" ||
    viewMode === "myCurrentState";
  const showCurrentState =
    viewMode === "show all" || viewMode === "myCurrentState";

  return (
    <div>
      {/* Example selector for demonstration */}
      <div className="mb-4">
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          className="border rounded p-2"
        >
          <option value="show all">Näytä kaikki</option>
          <option value="myMission">Muokkaa Missiota</option>
          <option value="keyObjectives">Muokkaa Tavoitteita</option>
          <option value="myTasks">Muokkaa Tehtäviä</option>
          <option value="myCurrentState">Muokkaa Nykytilaa</option>
        </select>
      </div>
      <div className="flex flex-col space-y-6">
        {showCoach && 
        <MyCoach 
        user={myObjectiveData.user} 
        viewMode={viewMode}
        />}
        <div className="bg-white p-4 rounded-lg shadow">
          {showMission && (
            <MyMission
              mission={myObjectiveData.mission}
              setMission={updateMission}
              username={username}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
          {showObjectives && (
            <KeyObjectives
              objectives={myObjectiveData.objectives}
              setObjectives={updateObjectives}
              username={username}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
          {showTasks && (
            <MyTasks
              tasks={myObjectiveData.tasks}
              setTasks={updateTasks}
              username={username}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
          {showCurrentState && (
            <MyCurrentState
              hindrances={myObjectiveData.hindrances}
              setHindrances={updateHindrances}
              promoters={myObjectiveData.promoters}
              setPromoters={updatePromoters}
              username={username}
              editMode={viewMode === "myCurrentState"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OmatTavoitteet;
