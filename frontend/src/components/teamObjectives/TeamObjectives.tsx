import React, { useEffect, useState } from "react";
import { Team, TeamObjective } from "../../types/types";

interface Props {
  selectedTeam: Team | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
}


const TeamObjectives: React.FC<Props> = ({ selectedTeam, setSelectedTeam  }) => {
  const [keyStrategies, setKeyStrategies] = useState<TeamObjective[]>([]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-bold text-gray-800">Tiimin Tavoitteet</h2>
      {keyStrategies.length > 0 ? (
        keyStrategies.map((obj, idx) => (
          <div key={idx} className="mb-2">
            <div><b>Nimi:</b> {obj.nimi}</div>
            <div><b>Mittari:</b> {obj.mittari}</div>
            <div><b>Seuranta:</b> {obj.seuranta}</div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ei tavoitteita.</p>
      )}
    </div>
  );
};

export default TeamObjectives;