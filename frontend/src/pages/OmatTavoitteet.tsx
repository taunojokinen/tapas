import { useEffect, useState } from "react";
import MyCoach from "../components/omatTavoitteet/myCoach";
import MyMission from "../components/omatTavoitteet/mymission"; // Adjust the path if necessary
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
  const [isEditingTitle, setIsEditingTitle] = useState(false); // State for editing title
  const [title, setTitle] = useState(""); // State for the new title

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


  return (
    <div>
      <div className="flex flex-col space-y-6">
        <MyCoach
          user={myObjectiveData.user}
        />
        <div className="bg-white p-4 rounded-lg shadow">
          <MyMission
            mission={myObjectiveData.mission}
            setMission={updateMission}
            username={username}
          />
          <KeyObjectives
            objectives={myObjectiveData.objectives}
            setObjectives={updateObjectives}
            username={username}
          />
          <MyTasks
            tasks={myObjectiveData.tasks}
            setTasks={updateTasks}
            username={username}
          />
          <MyCurrentState
            hindrances={myObjectiveData.hindrances}
            setHindrances={updateHindrances}
            promoters={myObjectiveData.promoters}
            setPromoters={updatePromoters}
            username={username}
          />
        </div>
      </div>
    </div>
  );
};

export default OmatTavoitteet;
