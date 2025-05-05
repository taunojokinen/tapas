import React from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
const MyTeamObjectives: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tiimin Tavoitteet</h1>
        <p className="text-gray-600 mt-2">
          Tervetuloa tiimin tavoitteiden hallintasivulle. Täällä voit tarkastella ja muokata tiimin tavoitteita.
        </p>
      </div>
      <MyTeams />
      <TeamObjectives />
      <TeamTasks />
      <TeamCurrentState />
    </div>
  );
};

export default MyTeamObjectives;