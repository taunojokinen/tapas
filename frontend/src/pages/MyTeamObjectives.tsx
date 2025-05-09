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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tiimin Tavoitteet - täällä voit tarkastella ja muokata tiimin tavoitteita. {teamObjectives.team.name}
        </h1>
      </div>

      <MyTeams />
      <TeamObjectives
        teamObjectives={teamObjectives}
        onUpdate={(updatedObjectives) => handleInputChange("objectives", updatedObjectives)}
      />

      {/* Team Current State */}




      {/* Tasks */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold text-gray-800">Tehtävät</h2>
        {teamObjectives.tasks.map((task, index) => (
          <div key={index} className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Tehtävä {index + 1}</label>
            <input
              type="text"
              value={task.nimi}
              onChange={(e) => {
                const updatedTasks = [...teamObjectives.tasks];
                updatedTasks[index].nimi = e.target.value;
                handleInputChange("tasks", updatedTasks);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
        <button
          onClick={handleAddTask}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Lisää tehtävä
        </button>
      </div>

      {/* Hindrances */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium text-gray-700">Esteet</label>
        <textarea
          value={teamObjectives.hindrances.join(", ")}
          onChange={(e) =>
            handleInputChange("hindrances", e.target.value.split(",").map((s) => s.trim()))
          }
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tallenna
        </button>
      </div>
    </div>
  );
};

export default MyTeamObjectives;