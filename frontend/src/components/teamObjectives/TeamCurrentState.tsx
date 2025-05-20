import React from "react";
import { Team } from "../../types/types";

interface Props {
  selectedTeam: Team | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
}

const TeamCurrentState: React.FC<Props> = ({ selectedTeam, setSelectedTeam }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold text-gray-800">Nykytila</h2>
      <p className="text-gray-600 mt-2">
        Tähän tulee kuvaus tiimin nkytilasta.
      </p>
      {/* Add team-related content or components here */}
    </div>
  );
};

export default TeamCurrentState;