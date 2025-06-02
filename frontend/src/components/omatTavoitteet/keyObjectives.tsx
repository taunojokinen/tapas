import React, { useState } from "react";
import { MyObjective } from "../../types/types";
import { patchMyObjectiveData } from "./myObjectiveFunctions";
import { ViewMode } from "../../types/enums";

interface KeyObjectivesProps {
  objectives: MyObjective[]; // Array of objectives
  setObjectives: React.Dispatch<React.SetStateAction<MyObjective[]>>; // Function to update objectives
  username: string;
  viewMode: ViewMode; // Current view mode
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}

const KeyObjectives: React.FC<KeyObjectivesProps> = ({
  objectives,
  setObjectives,
  username,
  viewMode, // Current view mode
  setViewMode, // Function to set the view mode
}) => {
  const [isEditing, setIsEditing] = useState(false); // Global editing state

  // Helper function to save changes
  const saveChanges = async (updatedObjectives: MyObjective[]) => {
    try {
      const payload = updatedObjectives;
      await patchMyObjectiveData(username, { objectives: payload });
      setObjectives(updatedObjectives);
    } catch (error) {
      console.error("Failed to save objectives:", error);
    }
  };

  // Add a new objective
  const handleAddObjective = () => {
    const newObjective: MyObjective = {
      nimi: "Uusi tavoite", // Esimerkkiarvo
      mittari: "Uusi mittari", // Esimerkkiarvo
      seuranta: "Uusi seuranta", // Esimerkkiarvo
    };
    const updatedObjectives = [...objectives, newObjective];
    saveChanges(updatedObjectives);
  };

  // Delete an objective
  const handleDeleteObjective = (index: number) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index);
    saveChanges(updatedObjectives);
  };

  // Move an objective up or down
  const handleMoveObjective = (index: number, direction: "up" | "down") => {
    const newObjectives = [...objectives];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    // Swap objectives
    [newObjectives[index], newObjectives[swapIndex]] = [
      newObjectives[swapIndex],
      newObjectives[index],
    ];

    saveChanges(newObjectives);
  };

  // Update an objective's text
  const handleObjectiveChange = (
    index: number,
    newValue: string,
    field: "nimi" | "mittari" | "seuranta"
  ) => {
    const updatedObjectives = objectives.map((objective, i) =>
      i === index
        ? { ...objective, [field]: newValue } // Päivitä vain määritelty kenttä
        : objective
    );
    saveChanges(updatedObjectives);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Avaintavoitteet - mitä tuloksia minun tulee saavuttaa edetäkseni kohti
          omaa päämäärääni
        </h2>
        {!isEditing && viewMode === ViewMode.ShowAll && (
          <button
            onClick={() => {
              setIsEditing(true);
              setViewMode(ViewMode.KeyObjectives); // Set view mode to key objectives
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Muokkaa
          </button>
        )}
      </div>
      <div className="w-full p-2 border border-gray-300 rounded mb-4">
        {objectives.length > 0 ? (
          objectives.map((objective, index) => (
            <div key={index} className="mb-4 flex items-center gap-4">
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
              <div className="flex-grow grid grid-cols-3 gap-4">
                {isEditing ? (
                  <>
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
          <p className="text-gray-500">Ei avaintavoitteita.</p>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddObjective}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Lisää uusi tavoite
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setViewMode(ViewMode.ShowAll); // Reset view mode to show all
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Valmis
          </button>
        </div>
      )}
    </div>
  );
};
export default KeyObjectives;
