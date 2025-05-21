import React, { useState } from "react";

interface Props {
  hindrances: string[];
  promoters: string[];
  onChangeHindrances?: (hindrances: string[]) => void;
  onChangePromoters?: (promoters: string[]) => void;
}

const TeamCurrentState: React.FC<Props> = ({
  hindrances: initialHindrances,
  promoters: initialPromoters,
  onChangeHindrances,
  onChangePromoters,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hindrances, setHindrances] = useState<string[]>(initialHindrances);
  const [promoters, setPromoters] = useState<string[]>(initialPromoters);

  // Sync with parent if props change
  React.useEffect(() => setHindrances(initialHindrances), [initialHindrances]);
  React.useEffect(() => setPromoters(initialPromoters), [initialPromoters]);

  // Hindrance handlers
  const handleHindranceChange = (index: number, value: string) => {
    const updated = hindrances.map((h, i) => (i === index ? value : h));
    setHindrances(updated);
    onChangeHindrances?.(updated);
  };
  const handleMoveHindrance = (index: number, direction: "up" | "down") => {
    const updated = [...hindrances];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setHindrances(updated);
    onChangeHindrances?.(updated);
  };
  const handleDeleteHindrance = (index: number) => {
    const updated = hindrances.filter((_, i) => i !== index);
    setHindrances(updated);
    onChangeHindrances?.(updated);
  };
  const handleAddHindrance = () => {
    const updated = [...hindrances, ""];
    setHindrances(updated);
    onChangeHindrances?.(updated);
  };

  // Promoter handlers
  const handlePromoterChange = (index: number, value: string) => {
    const updated = promoters.map((p, i) => (i === index ? value : p));
    setPromoters(updated);
    onChangePromoters?.(updated);
  };
  const handleMovePromoter = (index: number, direction: "up" | "down") => {
    const updated = [...promoters];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setPromoters(updated);
    onChangePromoters?.(updated);
  };
  const handleDeletePromoter = (index: number) => {
    const updated = promoters.filter((_, i) => i !== index);
    setPromoters(updated);
    onChangePromoters?.(updated);
  };
  const handleAddPromoter = () => {
    const updated = [...promoters, ""];
    setPromoters(updated);
    onChangePromoters?.(updated);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChangeHindrances?.(hindrances);
    onChangePromoters?.(promoters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Nykytila</h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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

export default TeamCurrentState;