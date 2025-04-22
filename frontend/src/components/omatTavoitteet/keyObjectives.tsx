import React, { useState } from "react";

const KeyObjectives: React.FC = () => {
  const [objectives, setObjectives] = useState<string[]>([
    "Parantaa tiimityöskentelyä",
    "Kehittää teknisiä taitoja",
    "Saavuttaa projektin tavoitteet",
  ]);
  const [isEditing, setIsEditing] = useState(false); // Global editing state

  // Add a new objective
  const handleAddObjective = () => {
    const newObjective = "Uusi tavoite";
    setObjectives((prevObjectives) => [...prevObjectives, newObjective]);
  };

  // Delete an objective
  const handleDeleteObjective = (index: number) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(updatedObjectives);
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

    setObjectives(newObjectives);
  };

  // Update an objective's text
  const handleObjectiveChange = (index: number, newValue: string) => {
    setObjectives((prevObjectives) =>
      prevObjectives.map((objective, i) =>
        i === index ? newValue : objective
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Avaintavoitteet</h2>
      {objectives.length > 0 ? (
        objectives.map((objective, index) => (
          <div key={index} className="mb-4 flex items-center gap-4">
            {/* Buttons in front of the row */}
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
            {/* Objective text */}
            <div className="flex-grow">
              {isEditing ? (
                <input
                  type="text"
                  value={objective}
                  onChange={(e) =>
                    handleObjectiveChange(index, e.target.value)
                  }
                  className="text-lg  border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="text-lg ">{objective}</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ei avaintavoitteita.</p>
      )}
      {/* Edit/Save and Cancel Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 ${
            isEditing
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded`}
        >
          {isEditing ? "Tallenna" : "Muokkaa"}
        </button>
        {isEditing && (
          <>
            <button
              onClick={handleAddObjective}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Lisää uusi tavoite
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Peruuta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default KeyObjectives;