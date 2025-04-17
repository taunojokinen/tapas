import React, { useState } from "react";

const KeyObjectives: React.FC = () => {
  const [objectives, setObjectives] = useState<string[]>([
    "Parantaa tiimityöskentelyä",
    "Kehittää teknisiä taitoja",
    "Saavuttaa projektin tavoitteet",
  ]);

  // Add a new objective
  const handleAddObjective = () => {
    const newObjective = "Uusi tavoite";
    setObjectives((prevObjectives) => [...prevObjectives, newObjective]);
  };

  // Move an objective up or down
  const handleMoveObjective = (index: number, direction: "up" | "down") => {
    const updatedObjectives = [...objectives];
    if (direction === "up" && index > 0) {
      [updatedObjectives[index - 1], updatedObjectives[index]] = [
        updatedObjectives[index],
        updatedObjectives[index - 1],
      ];
    } else if (direction === "down" && index < objectives.length - 1) {
      [updatedObjectives[index], updatedObjectives[index + 1]] = [
        updatedObjectives[index + 1],
        updatedObjectives[index],
      ];
    }
    setObjectives(updatedObjectives);
  };

  // Delete an objective
  const handleDeleteObjective = (index: number) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(updatedObjectives);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Avaintavoitteet</h2>
      {objectives.length > 0 ? (
        objectives.map((objective, index) => (
          <div key={index} className="mb-4 flex items-center gap-4">
            {/* Buttons in front of the row */}
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
              <h1>
                <strong>{index + 1}</strong>
              </h1>
            </div>
            {/* Objective text */}
            <div className="flex-grow">
              <input
                type="text"
                value={objective}
                onChange={(e) =>
                  setObjectives((prevObjectives) =>
                    prevObjectives.map((obj, i) =>
                      i === index ? e.target.value : obj
                    )
                  )
                }
                className="text-lg font-bold border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ei avaintavoitteita.</p>
      )}
      {/* Add Objective Button */}
      <button
        onClick={handleAddObjective}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
      >
        Lisää tavoite
      </button>
    </div>
  );
};

export default KeyObjectives;