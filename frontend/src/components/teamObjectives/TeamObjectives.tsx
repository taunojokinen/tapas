import React, { useEffect, useState } from "react";
import { FetchKeyStrategies } from "./TeamObjectiveFunctions"; // Import the fetch function
import { Team, TeamObjective } from "../../types/types";

interface TeamObjectivesProps {
  teamObjectives: Team; // Use the correct type for teamObjectives
  onUpdate: (updatedObjectives: Team) => void; // Use the correct type for updatedObjectives
}


const TeamObjectives: React.FC<TeamObjectivesProps> = ({ teamObjectives, onUpdate }) => {
  const [keyStrategies, setKeyStrategies] = useState<TeamObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<TeamObjective | null>(null);
  const [newTeamObjective, setNewTeamObjective] = useState<TeamObjective>({
    nimi: "",
    mittari: "",
    seuranta: "",
    tasks: [],
    hindrances: [],
    promoters: [],
  });


  return (
    <div>
      <h1>Team Objectives</h1>
      {/* Add more JSX elements here as needed */}
    </div>
  );
};

export default TeamObjectives;