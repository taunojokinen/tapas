import React, { useState, useEffect } from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
import useAuth from "../hooks/useAuth"; // Import the custom hook
import { MyObjective, MyTask, Team,  } from "../types/types";
import { handleTeamAndObjectiveSelect } from "../components/teamObjectives/TeamFunctions"; // Import the function

const MyTeamObjectives: React.FC = () => {
  const { username } = useAuth(); // Get the logged-in user's username

    // Create a useState of type Team
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);



  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tiimin Tavoitteet - täällä voit tarkastella ja muokata tiimin
          tavoitteita. 
        </h1>
      </div>
            {/* Render MyTeams component */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
        <MyTeams
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
        />
      </div>
      </div>

)};

export default MyTeamObjectives;
