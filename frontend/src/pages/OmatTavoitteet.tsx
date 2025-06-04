import { useEffect, useState } from "react";
import MyCoach from "../components/omatTavoitteet/myCoach"; // Use correct casing everywhere
import MyMission from "../components/omatTavoitteet/myMission";
import KeyObjectives from "../components/omatTavoitteet/keyObjectives";
import MyTasks from "../components/omatTavoitteet/myTasks";
import MyCurrentState from "../components/omatTavoitteet/myCurrenState";
import useAuth from "../hooks/useAuth";
import type { MyMission as MyMissionType, MyObjective, MyTask, MyObjectivesJson } from "../types/types";
import { fetchMyObjectiveData } from "../components/omatTavoitteet/myObjectiveFunctions";
import { ViewMode } from "../types/enums";

const OmatTavoitteet = () => {
  const { username } = useAuth();
  const [myObjectiveData, setMyObjectiveData] =
    useState<MyObjectivesJson | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ShowAll);

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        const data = await fetchMyObjectiveData(username);
        if (data) {
          setMyObjectiveData(data);
        }
      }
    };

    fetchData();
  }, [username]);

  if (!myObjectiveData) {
    return <p>Loading...</p>;
  }

  // Handlers to update specific parts of the state
  const updateMission: React.Dispatch<React.SetStateAction<MyMissionType>> = (
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
    viewMode === ViewMode.ShowAll ||
    viewMode === ViewMode.MyMission ||
    viewMode === ViewMode.KeyObjectives ||
    viewMode === ViewMode.MyTasks ||
    viewMode === ViewMode.MyCurrentState;
  const showObjectives =
    viewMode === ViewMode.ShowAll ||
    viewMode === ViewMode.KeyObjectives ||
    viewMode === ViewMode.MyTasks ||
    viewMode === ViewMode.MyCurrentState;
  const showTasks =
    viewMode === ViewMode.ShowAll ||
    viewMode === ViewMode.MyTasks ||
    viewMode === ViewMode.MyCurrentState;
  const showCurrentState =
    viewMode === ViewMode.ShowAll || viewMode === ViewMode.MyCurrentState;

  return (
    <div>
      <div className="flex flex-col space-y-6">
        {showCoach && (
          <MyCoach
            username={myObjectiveData.user}
            viewMode={viewMode}
            mission={myObjectiveData.mission}
            setMission={updateMission}
          />
        )}
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
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OmatTavoitteet;