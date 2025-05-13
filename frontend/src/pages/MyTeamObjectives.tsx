import React, { useState } from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
import useAuth from "../hooks/useAuth"; // Import the custom hook
import { MyObjective, MyTask, Team, MyTeamObjectivesJson } from "../types/types";

const MyTeamObjectives: React.FC = () => {
  const { username } = useAuth(); // Get the logged-in user's username
  const [teamObjectives, setTeamObjectives] = useState<MyTeamObjectivesJson>({
    user: username || "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    team: { _id: "", owner: "", name: "", type: "", mission: "", members: [] }, // Default empty team
    objectives: { nimi: "", mittari: "", seuranta: "" }, // Default empty objectives
    tasks: [], // Default empty tasks
    hindrances: [], // Default empty hindrances
  });

  const handleInputChange = (field: keyof MyTeamObjectivesJson, value: any) => {
    setTeamObjectives((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTask = () => {
    setTeamObjectives((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { nimi: "", mittari: "", seuranta: "" }],
    }));
  };

  const handleSave = () => {
    console.log("Saving team objectives:", teamObjectives);
    // Add logic to save the data to the backend
  };

  const isTeamSelected = teamObjectives.team._id !== ""; // Check if a team is selected
  const areObjectivesSelected =
    teamObjectives.objectives.nimi !== "" ||
    teamObjectives.objectives.mittari !== "" ||
    teamObjectives.objectives.seuranta !== ""; // Check if objectives are selected

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tiimin Tavoitteet - täällä voit tarkastella ja muokata tiimin tavoitteita.{" "}
          {teamObjectives.team.name}
        </h1>
      </div>

<MyTeams
onTeamSelect={(selectedTeam) => {
  alert(`Selected team: ${JSON.stringify(selectedTeam)}`);
  handleInputChange("team", selectedTeam);
}}
/>
<TeamObjectives
  teamObjectives={teamObjectives}
  onUpdate={(updatedObjectives) => {
    alert(`Updated objectives: ${JSON.stringify(updatedObjectives)}`);
    handleInputChange("objectives", updatedObjectives.objectives);
  }}
/>

      {/* Conditionally render TeamTasks and Save Button */}
      {isTeamSelected && areObjectivesSelected && (
        <>
          <TeamTasks
            tasks={teamObjectives.tasks}
            onUpdate={(updatedTasks) => handleInputChange("tasks", updatedTasks)}
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