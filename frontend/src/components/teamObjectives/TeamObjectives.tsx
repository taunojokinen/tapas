import React, { useState, useEffect } from "react";
import { Team, TeamObjective } from "../../types/types";
import { putTeamObjectiveData, fetchCompanyObjectives } from "./TeamObjectiveFunctions";

interface Props {
  selectedTeam: Team | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  onSelectObjective?: (index: number) => void;
  selectedObjectiveIndex?: number | null;
}

const TeamObjectives: React.FC<Props> = ({
  selectedTeam,
  setSelectedTeam,
  onSelectObjective,
  selectedObjectiveIndex
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [objectives, setObjectives] = useState<TeamObjective[]>([]);
  const [showCompanyObjectiveSelector, setShowCompanyObjectiveSelector] = useState(false);
  const [companyObjectives, setCompanyObjectives] = useState<TeamObjective[]>([]);
  const [selectedCompanyObjective, setSelectedCompanyObjective] = useState<TeamObjective | null>(null);

  useEffect(() => {
    if (selectedTeam) {
      setObjectives(selectedTeam.teamObjectives ?? []);
    }
  }, [selectedTeam]);

  // Fetch company objectives when selector is opened
  const handleOpenCompanyObjectiveSelector = async () => {
    setShowCompanyObjectiveSelector(true);
    if (companyObjectives.length === 0) {
      const fetched = await fetchCompanyObjectives("");
      if (fetched) setCompanyObjectives(fetched);
    }
  };

  // Save changes to backend and local state
  const saveChanges = async (updatedObjectives: TeamObjective[]) => {
    if (!selectedTeam) return;
    const updatedTeam = { ...selectedTeam, teamObjectives: updatedObjectives };
    setObjectives(updatedObjectives);
    setSelectedTeam(updatedTeam);
    try {
      await putTeamObjectiveData(selectedTeam._id, updatedTeam);
    } catch (error) {
      console.error("Failed to update objectives in backend:", error);
    }
  };

  // Add selected company objective
const handleAddSelectedCompanyObjective = () => {
  if (!selectedCompanyObjective) return;
  // Ensure type is set to "company"
  const companyObjectiveWithType = { ...selectedCompanyObjective, type: "company" };
  const updatedObjectives = [...objectives, companyObjectiveWithType];
  saveChanges(updatedObjectives);
  setShowCompanyObjectiveSelector(false);
  setSelectedCompanyObjective(null);
};

  // ...rest of your handlers (handleDeleteObjective, handleMoveObjective, handleObjectiveChange)...

  // Add a new empty team objective
  function handleAddTeamObjective(): void {
    if (!isEditing) return;
    const newObjective: TeamObjective = {
      type: "team",
      nimi: "",
      mittari: "",
      seuranta: "",
      tasks: [],
      hindrances: [],
      promoters: []
    };
    const updatedObjectives = [...objectives, newObjective];
    setObjectives(updatedObjectives);
  }

  // Delete an objective by index
  function handleDeleteObjective(index: number): void {
    if (!isEditing) return;
    const updatedObjectives = objectives.filter((_, i) => i !== index);
    saveChanges(updatedObjectives);
  }

  if (!selectedTeam) return null;

  function handleMoveObjective(index: number, direction: "up" | "down"): void {
    if (!isEditing) return;
    const newObjectives = [...objectives];
    if (direction === "up" && index > 0) {
      [newObjectives[index - 1], newObjectives[index]] = [newObjectives[index], newObjectives[index - 1]];
      setObjectives(newObjectives);
    } else if (direction === "down" && index < newObjectives.length - 1) {
      [newObjectives[index + 1], newObjectives[index]] = [newObjectives[index], newObjectives[index + 1]];
      setObjectives(newObjectives);
    }
  }

  function handleObjectiveChange(index: number, value: string, field: keyof TeamObjective): void {
    if (!isEditing) return;
    const updatedObjectives = objectives.map((obj, i) =>
      i === index ? { ...obj, [field]: value } : obj
    );
    setObjectives(updatedObjectives);
  }

  return (
  <div className="bg-white p-4 rounded-lg shadow mb-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">Tiimin Tavoitteet</h2>
      <button
        onClick={() => {
          if (isEditing) {
            saveChanges(objectives); // Save when finishing editing
          }
          setIsEditing(!isEditing);
        }}
        className={`px-4 py-2 ${
          isEditing
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white rounded`}
      >
        {isEditing ? "Tallenna" : "Muokkaa"}
      </button>
    </div>
    <div className="w-full p-2 border border-gray-300 rounded mb-4">
      {objectives.length > 0 ? (
        objectives.map((objective, index) => (
          <div
            key={index}
            className={`mb-4 flex items-center gap-4 cursor-pointer ${
              !isEditing && selectedObjectiveIndex === index ? "bg-blue-100" : ""
            }`}
            onClick={() => {
              if (!isEditing && onSelectObjective) onSelectObjective(index);
            }}
          >
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveObjective(index, "up")}
                  disabled={index === 0}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveObjective(index, "down")}
                  disabled={index === objectives.length - 1}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleDeleteObjective(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>
            )}
            <div className="flex-grow grid grid-cols-4 gap-4">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={objective.type}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value, "type")
                    }
                    className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  <input
                    type="text"
                    value={objective.nimi}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value, "nimi")
                    }
                    className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  <input
                    type="text"
                    value={objective.mittari}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value, "mittari")
                    }
                    className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  <select
                    value={objective.seuranta}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value, "seuranta")
                    }
                    className="w-full p-1 border"
                  >
                    <option value="">Valitse</option>
                    <option value="Punainen">🔴 Punainen</option>
                    <option value="Keltainen">🟡 Keltainen</option>
                    <option value="Vihreä">🟢 Vihreä</option>
                  </select>
                </>
              ) : (
                <>
                  <p className="text-lg">{objective.type}</p>
                  <p className="text-lg">{objective.nimi}</p>
                  <p className="text-lg">{objective.mittari}</p>
                  <p className="text-lg">
                    {objective.seuranta === "Punainen" && "🔴 Punainen"}
                    {objective.seuranta === "Keltainen" && "🟡 Keltainen"}
                    {objective.seuranta === "Vihreä" && "🟢 Vihreä"}
                  </p>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ei tiimin tavoitteita.</p>
      )}
    </div>
    {isEditing && (
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleOpenCompanyObjectiveSelector}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Lisää yrityksen tavoite
        </button>
        <button
          onClick={handleAddTeamObjective}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Lisää tiimin tavoite
        </button>
        {showCompanyObjectiveSelector && (
          <div className="flex items-center gap-2">
            <select
              value={selectedCompanyObjective?.nimi || ""}
              onChange={e => {
                const obj = companyObjectives.find(o => o.nimi === e.target.value);
                setSelectedCompanyObjective(obj || null);
              }}
              className="border rounded p-2"
            >
              <option value="">Valitse yrityksen tavoite</option>
              {companyObjectives.map((obj, idx) => (
                <option key={idx} value={obj.nimi}>
                  {obj.nimi} ({obj.mittari})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddSelectedCompanyObjective}
              disabled={!selectedCompanyObjective}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lisää tiimin tavoitteisiin
            </button>
            <button
              onClick={() => setShowCompanyObjectiveSelector(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Peruuta
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default TeamObjectives;