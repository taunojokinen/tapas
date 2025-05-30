import React, { useState } from "react";
import { patchMyObjectiveData } from "./myObjectiveFunctions";

interface MyCurrentStateProps {
  hindrances: string[];
  setHindrances: React.Dispatch<React.SetStateAction<string[]>>;
  promoters: string[];
  setPromoters: React.Dispatch<React.SetStateAction<string[]>>;
  username: string;
  editMode?: boolean; // Optional prop for edit mode
}

const MyCurrentState: React.FC<MyCurrentStateProps> = ({
  hindrances,
  setHindrances,
  promoters,
  setPromoters,
  username,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Add a new hindrance
  const handleAddHindrance = async () => {
    const updatedHindrances = [...hindrances, ""];
    setHindrances(updatedHindrances);
    await patchMyObjectiveData(username, { hindrances: updatedHindrances });
  };

  // Add a new promoter
  const handleAddPromoter = async () => {
    const updatedPromoters = [...promoters, ""];
    setPromoters(updatedPromoters);
    await patchMyObjectiveData(username, { promoters: updatedPromoters });
  };

  // Delete a hindrance
  const handleDeleteHindrance = async (index: number) => {
    const updatedHindrances = hindrances.filter((_, i) => i !== index);
    setHindrances(updatedHindrances);
    await patchMyObjectiveData(username, { hindrances: updatedHindrances });
  };

  // Delete a promoter
  const handleDeletePromoter = async (index: number) => {
    const updatedPromoters = promoters.filter((_, i) => i !== index);
    setPromoters(updatedPromoters);
    await patchMyObjectiveData(username, { promoters: updatedPromoters });
  };

  // Move a hindrance up or down
  const handleMoveHindrance = async (
    index: number,
    direction: "up" | "down"
  ) => {
    const newHindrances = [...hindrances];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newHindrances[index], newHindrances[swapIndex]] = [
      newHindrances[swapIndex],
      newHindrances[index],
    ];
    setHindrances(newHindrances);
    await patchMyObjectiveData(username, { hindrances: newHindrances });
  };

  // Move a promoter up or down
  const handleMovePromoter = async (
    index: number,
    direction: "up" | "down"
  ) => {
    const newPromoters = [...promoters];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newPromoters[index], newPromoters[swapIndex]] = [
      newPromoters[swapIndex],
      newPromoters[index],
    ];
    setPromoters(newPromoters);
    await patchMyObjectiveData(username, { promoters: newPromoters });
  };

  // Update hindrance text
  const handleHindranceChange = async (index: number, value: string) => {
    const updatedHindrances = hindrances.map((item, i) =>
      i === index ? value : item
    );
    setHindrances(updatedHindrances);
    await patchMyObjectiveData(username, { hindrances: updatedHindrances });
  };

  // Update promoter text
  const handlePromoterChange = async (index: number, value: string) => {
    const updatedPromoters = promoters.map((item, i) =>
      i === index ? value : item
    );
    setPromoters(updatedPromoters);
    await patchMyObjectiveData(username, { promoters: updatedPromoters });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Nykytila</h2>
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Hindrances Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Mikä estää tavoitteiden saavuttamista
          </h3>
          {hindrances.map((hindrance, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              {isEditing ? (
                <>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveHindrance(index, "up")}
                      disabled={index === 0}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveHindrance(index, "down")}
                      disabled={index === hindrances.length - 1}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleDeleteHindrance(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={2}
                    value={hindrance}
                    onChange={(e) =>
                      handleHindranceChange(index, e.target.value)
                    }
                    placeholder="Kirjoita tähän..."
                  ></textarea>
                </>
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded">
                  {hindrance || "Ei sisältöä"}
                </p>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={handleAddHindrance}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Lisää uusi
            </button>
          )}
        </div>
        {/* Promoters Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Mikä edistää tavoitteiden saavuttamista
          </h3>
          {promoters.map((promoter, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              {isEditing ? (
                <>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMovePromoter(index, "up")}
                      disabled={index === 0}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMovePromoter(index, "down")}
                      disabled={index === promoters.length - 1}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleDeletePromoter(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={2}
                    value={promoter}
                    onChange={(e) =>
                      handlePromoterChange(index, e.target.value)
                    }
                    placeholder="Kirjoita tähän..."
                  ></textarea>
                </>
              ) : (
                <p className="w-full p-2 border border-gray-300 rounded">
                  {promoter || "Ei sisältöä"}
                </p>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={handleAddPromoter}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Lisää uusi
            </button>
          )}
        </div>
      </div>
      {/* Edit/Save and Cancel Buttons */}
      {isEditing && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Peruuta
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCurrentState;
