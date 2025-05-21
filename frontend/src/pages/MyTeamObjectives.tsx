import React, { useState } from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
import useAuth from "../hooks/useAuth";
import { Team } from "../types/types";
import { putTeamObjectiveData, putTeamObjectivesArray } from "../components/teamObjectives/TeamObjectiveFunctions";
// Import or define updateObjectives
// Example import (adjust the path as needed):
// import { updateObjectives } from "../api/objectives";
const updateObjectives = async (username: string, objectives: any) => {
  // TODO: Implement API call to persist objectives
  console.log("Persisting objectives for", username, objectives);
};

const MyTeamObjectives: React.FC = () => {
  const { username } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedObjectiveIndex, setSelectedObjectiveIndex] = useState<number | null>(null);

  // Get the selected objective if available
  const selectedObjective: Team["teamObjectives"][number] | undefined =
    selectedTeam && selectedObjectiveIndex !== null
      ? selectedTeam.teamObjectives[selectedObjectiveIndex]
      : undefined;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tiimin Tavoitteet - täällä voit tarkastella ja muokata tiimin tavoitteita.
        </h1>
      </div>
    <MyTeams selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />
<TeamObjectives
  selectedTeam={selectedTeam}
  setSelectedTeam={async (updatedTeam) => {
    setSelectedTeam(updatedTeam);
    // Persist the whole objectives array to backend
    if (updatedTeam && typeof updatedTeam === "object" && "_id" in updatedTeam && "teamObjectives" in updatedTeam) {
      await putTeamObjectivesArray(updatedTeam._id, updatedTeam.teamObjectives);
    }
  }}
  selectedObjectiveIndex={selectedObjectiveIndex}
  onSelectObjective={setSelectedObjectiveIndex}
/>
<TeamTasks
  tasks={selectedObjective?.tasks ?? []}
  onTasksChange={async (updatedTasks) => {
    if (!selectedTeam || selectedObjectiveIndex === null) return;
    // Update the tasks for the selected objective
    const updatedObjectives = selectedTeam.teamObjectives.map((obj, idx) =>
      idx === selectedObjectiveIndex ? { ...obj, tasks: updatedTasks } : obj
    );
    setSelectedTeam({ ...selectedTeam, teamObjectives: updatedObjectives });

    // Persist only the updated objective to backend
    const updatedObjective = updatedObjectives[selectedObjectiveIndex];
    await putTeamObjectiveData(updatedObjective._id, updatedObjective);
  }}
/>
    <TeamCurrentState
      hindrances={selectedObjective?.hindrances ?? []}
      promoters={selectedObjective?.promoters ?? []}
    />
  </div>
  );
};

export default MyTeamObjectives;
