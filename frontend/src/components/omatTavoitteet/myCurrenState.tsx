import React, { useState } from "react";

interface MyCurrentStateProps {
    hindrances: string[];
    setHindrances: React.Dispatch<React.SetStateAction<string[]>>;
    promoters: string[];
    setPromoters: React.Dispatch<React.SetStateAction<string[]>>;
  }

  const MyCurrentState: React.FC<MyCurrentStateProps> = ({
    hindrances,
    setHindrances,
    promoters,
    setPromoters,
  }) => {

  const [isEditing, setIsEditing] = useState(false);

  // Add a new hindrance
  const handleAddHindrance = () => {
    setHindrances((prev) => [...prev, ""]);
  };

  // Add a new promoter
  const handleAddPromoter = () => {
    setPromoters((prev) => [...prev, ""]);
  };

  // Delete a hindrance
  const handleDeleteHindrance = (index: number) => {
    setHindrances((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete a promoter
  const handleDeletePromoter = (index: number) => {
    setPromoters((prev) => prev.filter((_, i) => i !== index));
  };

  // Move a hindrance up or down
  const handleMoveHindrance = (index: number, direction: "up" | "down") => {
    const newHindrances = [...hindrances];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newHindrances[index], newHindrances[swapIndex]] = [
      newHindrances[swapIndex],
      newHindrances[index],
    ];
    setHindrances(newHindrances);
  };

  // Move a promoter up or down
  const handleMovePromoter = (index: number, direction: "up" | "down") => {
    const newPromoters = [...promoters];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newPromoters[index], newPromoters[swapIndex]] = [
      newPromoters[swapIndex],
      newPromoters[index],
    ];
    setPromoters(newPromoters);
  };

  // Update hindrance text
  const handleHindranceChange = (index: number, value: string) => {
    setHindrances((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  // Update promoter text
  const handlePromoterChange = (index: number, value: string) => {
    setPromoters((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Nykytila</h2>
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
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Peruuta
          </button>
        )}
      </div>
    </div>
  );
};

export default MyCurrentState;