import React, { useState, useEffect } from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
import useAuth from "../hooks/useAuth"; // Import the custom hook
import { MyObjective, MyTask, Team, TeamObjectivesJson } from "../types/types";
import { handleTeamAndObjectiveSelect } from "../components/teamObjectives/TeamFunctions"; // Import the function

const MyTeamObjectives: React.FC = () => {
  const { username } = useAuth(); // Get the logged-in user's username
  const [teamObjectives, setTeamObjectives] = useState<TeamObjectivesJson>({
    user: username || "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    team: { _id: "", owner: "", name: "", type: "", mission: "", members: [] }, // Default empty team
    objectives: {_id: "", nimi: "", mittari: "", seuranta: "" }, // Default empty objectives
    tasks: [], // Default empty tasks
    hindrances: [], // Default empty hindrances
  });

  const isTeamSelected = teamObjectives.team._id !== ""; // Check if a team is selected
  const areObjectivesSelected =
    teamObjectives.objectives.nimi !== "" ||
    teamObjectives.objectives.mittari !== "" ||
    teamObjectives.objectives.seuranta !== ""; // Check if objectives are selected

  // Call handleTeamAndObjectiveSelect when both team and objectives are selected
  useEffect(() => {
    if (isTeamSelected && areObjectivesSelected && teamObjectives.team._id && teamObjectives.objectives._id) {
      console.log("Team ID: ", teamObjectives.team._id, " Objective ID:", teamObjectives.objectives._id);
      handleTeamAndObjectiveSelect(
        teamObjectives.team._id, // teamId
        teamObjectives.objectives._id, // objectiveId
        username, // user
        (teamObjective) => {
          // Update the state with the returned data
          setTeamObjectives((prev) => ({
            ...prev,
            ...teamObjective,
          }));
        }
      );
    }
  }, [
    isTeamSelected,
    areObjectivesSelected,
    teamObjectives.team._id,
    teamObjectives.objectives._id,
    username,
  ]);

  const handleInputChange = (field: keyof TeamObjectivesJson, value: any) => {
    console.log(`Updating field: ${field}`, value); // Debug log
    setTeamObjectives((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving team objectives:", teamObjectives);
    // Add logic to save the data to the backend
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tiimin Tavoitteet - täällä voit tarkastella ja muokata tiimin
          tavoitteita. {teamObjectives.team.name}
        </h1>
      </div>

      <MyTeams
        onTeamSelect={(selectedTeam) => {
          handleInputChange("team", selectedTeam);
        }}
      />
<TeamObjectives
  teamObjectives={teamObjectives}
  onUpdate={(updatedObjectives) => {
    console.log("Updated Objectives:", updatedObjectives); // Debug log
    handleInputChange("objectives", updatedObjectives.objectives); // Pass the entire array
  }}
/>

      {/* Conditionally render TeamTasks and Save Button */}
      {isTeamSelected && areObjectivesSelected && (
        <>
          <TeamTasks
            tasks={teamObjectives.tasks}
            onUpdate={(updatedTasks) =>
              handleInputChange("tasks", updatedTasks)
            }
          />

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tallenna
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyTeamObjectives;
