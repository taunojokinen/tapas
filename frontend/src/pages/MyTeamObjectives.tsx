import React, { useState } from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
import useAuth from "../hooks/useAuth";
import { Team } from "../types/types";

const MyTeamObjectives: React.FC = () => {
  const { username } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedObjectiveIndex, setSelectedObjectiveIndex] = useState<number | null>(null);

  // Get the selected objective if available
  const selectedObjective =
    selectedTeam &&
    selectedObjectiveIndex !== null &&
    selectedTeam.teamObjectives[selectedObjectiveIndex];

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
        setSelectedTeam={setSelectedTeam}
        onSelectObjective={setSelectedObjectiveIndex}
        selectedObjectiveIndex={selectedObjectiveIndex}
      />
      {selectedObjective && (
        <>
          <TeamTasks tasks={selectedObjective.tasks} />
          <TeamCurrentState
            hindrances={selectedObjective.hindrances}
            promoters={selectedObjective.promoters}
          />
        </>
      )}
    </div>
  );
};

export default MyTeamObjectives;
