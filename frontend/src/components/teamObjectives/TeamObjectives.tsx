import React, { useEffect, useState } from "react";
import { FetchKeyStrategies } from "./TeamObjectiveFunctions"; // Import the fetch function
import { TeamObjectivesJson, TeamObjective } from "../../types/types";

interface TeamObjectivesProps {
  teamObjectives: TeamObjectivesJson; // Use the correct type for teamObjectives
  onUpdate: (updatedObjectives: TeamObjectivesJson) => void; // Use the correct type for updatedObjectives
}
interface KeyStrategy {
  _id: string; // MongoDB ID for the strategy
  nimi: string; // Name of the strategy
  mittari: string; // Description of the strategy
  seuranta: string; // Tracking method for the strategy
}

const TeamObjectives: React.FC<TeamObjectivesProps> = ({ teamObjectives, onUpdate }) => {
  const [keyStrategies, setKeyStrategies] = useState<KeyStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<KeyStrategy | null>(null);
  const [newStrategy, setNewStrategy] = useState<KeyStrategy>({
    _id: "", // Temporary ID will be generated
    nimi: "",
    mittari: "",
    seuranta: "",
  });

  useEffect(() => {
    console.log("useEffect triggered: Fetching strategies...");
    const fetchStrategies = async () => {
      try {
        const strategies = await FetchKeyStrategies();
        console.log("Strategies fetched:", strategies);
        setKeyStrategies(strategies);
      } catch (error) {
        console.error("Failed to fetch key strategies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  if (loading) {
    return <p>Loading key strategies...</p>;
  }

  const handleStrategySelect = (strategyId: string) => {
    const strategy = keyStrategies.find((s) => s._id === strategyId);
    if (strategy) {
      console.log("Selected Strategy:", strategy); // Debug log
      setSelectedStrategy(strategy);
      console.log("Selected Strategy:", strategy); // Debug log
      // Notify the parent component about the selected strategy
      onUpdate({
        ...teamObjectives,
        objectives: {
          _id: strategy._id,
          nimi: strategy.nimi,
          mittari: strategy.mittari,
          seuranta: strategy.seuranta,
        },
      });
    } else {
      console.error(`Strategy with ID ${strategyId} not found.`);
    }
  };
  const handleShowAllStrategies = () => {
    console.log("Clearing objectives"); // Debug log
    setSelectedStrategy(null);
    onUpdate({
      ...teamObjectives,
      objectives: { _id: "", nimi: "", mittari: "", seuranta: "" }, // Clear objectives
    });
  };
  const handleAddStrategy = () => {
    if (!newStrategy.nimi || !newStrategy.mittari || !newStrategy.seuranta) {
      alert("Please fill in all fields for the new strategy.");
      return;
    }

    const strategyToAdd = {
      ...newStrategy,
      _id: Date.now().toString(), // Generate a unique ID for the new strategy
    };

    setKeyStrategies((prevStrategies) => [...prevStrategies, strategyToAdd]);
    setNewStrategy({ _id: "", nimi: "", mittari: "", seuranta: "" }); // Reset the input fields
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between">
        {!selectedStrategy && <h2 className="text-xl font-bold text-gray-800">Key Strategies</h2>}
      </div>
      {selectedStrategy ? (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <div className="flex items-center justify-between">
            <span className="flex-1">
              <strong>Valittu strategia:</strong> {selectedStrategy.nimi}
            </span>
            <span className="flex-1 text-center">
              <strong>Mittari:</strong> {selectedStrategy.mittari}
            </span>
            <span className="flex-1 text-right">
              <strong>Seuranta:</strong> {selectedStrategy.seuranta}
            </span>
            <button
              onClick={handleShowAllStrategies}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Show All Strategies
            </button>
          </div>
        </div>
      ) : (
        <>
          {keyStrategies.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {keyStrategies.map((strategy) => (
                <li
                  key={strategy._id}
                  className="p-2 border border-gray-300 rounded flex justify-between items-center hover:bg-gray-100"
                  onClick={() => handleStrategySelect(strategy._id)}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{strategy.nimi}</h3>
                    <p className="text-sm text-gray-600">{strategy.mittari}</p>
                    <p className="text-sm text-gray-600">{strategy.seuranta}</p>
                  </div>
                </li>
              ))}
              {/* Customizable entry */}
              <li className="p-2 border border-gray-300 rounded flex justify-between items-center hover:bg-gray-100">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Strategy Name"
                    value={newStrategy.nimi}
                    onChange={(e) => setNewStrategy({ ...newStrategy, nimi: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Metric"
                    value={newStrategy.mittari}
                    onChange={(e) => setNewStrategy({ ...newStrategy, mittari: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tracking"
                    value={newStrategy.seuranta}
                    onChange={(e) => setNewStrategy({ ...newStrategy, seuranta: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  onClick={handleAddStrategy}
                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add
                </button>
              </li>
            </ul>
          ) : (
            <p className="text-gray-600 mt-4">No key strategies found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TeamObjectives;