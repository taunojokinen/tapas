import React from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
import useAuth from "../hooks/useAuth"; // Import the custom hook
import { MyObjective, MyTask, Team, MyTeamObjectivesJson } from "../types/types";
const MyTeamObjectives: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tiimin Tavoitteet -täällä voit tarkastella ja muokata tiimin tavoitteita.</h1>
      </div>
      <MyTeams />
      <TeamObjectives />
      <TeamTasks />
      <TeamCurrentState />
    </div>
  );
};

export default MyTeamObjectives;  