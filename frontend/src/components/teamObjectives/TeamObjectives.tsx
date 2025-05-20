import React, { useEffect, useState } from "react";
import { Team, TeamObjective } from "../../types/types";
//import { fetchCompanyObjectives, updateObjectives  } from "../ObjectiveFunctions";
import { putTeamObjectiveData, fetchCompanyObjectives } from "./TeamObjectiveFunctions"; // Import your function

interface Props {
  selectedTeam: Team | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
}

const TeamObjectives: React.FC<Props> = ({ selectedTeam, setSelectedTeam }) => {
  const [companyObjectives, setCompanyObjectives] = useState<TeamObjective[]>([]);
  const [selectedCompanyObjective, setSelectedCompanyObjective] = useState<TeamObjective | null>(null);

  useEffect(() => {
    fetchCompanyObjectives("").then((objectives) => {
      if (objectives) setCompanyObjectives(objectives);
    });
  }, []);

  if (!selectedTeam) {
    return null;
  }

  const objectives = selectedTeam.teamObjectives ?? [];

const handleAddCompanyObjective = async () => {
  if (!selectedCompanyObjective || !selectedTeam) return;
  const updatedObjectives = [...objectives, selectedCompanyObjective];
  const updatedTeam = {
    ...selectedTeam,
    teamObjectives: updatedObjectives,
  };
  setSelectedTeam(updatedTeam);
  setSelectedCompanyObjective(null);

  // Persist to backend
  try {
    await putTeamObjectiveData(selectedTeam._id, updatedTeam);
  } catch (error) {
    console.error("Failed to update objectives in backend:", error);
  }
};

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-bold text-gray-800">Tiimin Tavoitteet</h2>

      {/* Company objectives selector */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Lisää yrityksen tavoite tiimille:</label>
        <select
          className="border rounded p-2 w-full"
          value={selectedCompanyObjective ? selectedCompanyObjective.nimi : ""}
          onChange={e => {
            const obj = companyObjectives.find(o => o.nimi === e.target.value);
            setSelectedCompanyObjective(obj || null);
          }}
        >
          <option value="">Valitse yrityksen tavoite</option>
          {companyObjectives.map((obj, idx) => (
            <option key={idx} value={obj.nimi}>
              {obj.nimi} ({obj.mittari})
            </option>
          ))}
        </select>
        <button
          className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
          onClick={handleAddCompanyObjective}
          disabled={!selectedCompanyObjective}
        >
          Lisää tiimin tavoitteisiin
        </button>
      </div>

      {objectives.length > 0 ? (
        objectives.map((obj, idx) => (
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