import React, { useState } from "react";
import { patchMyObjectiveData } from "./myObjectiveFunctions";


interface MyMissionProps {
  mission: string; // Lisää mission propseihin
  setMission: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  viewMode: string; // Current view mode
  setViewMode: (mode: string) => void;
}

const MyMission: React.FC<MyMissionProps> = ({ 
  mission, 
  setMission, 
  username,
  viewMode,  
  setViewMode
}) => {

  const [isEditing, setIsEditing] = useState(false);

  const handleMissionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMission(event.target.value);
  };

  const handleSaveMission = async () => {
    try {

  
      // Call the backend to save the updated mission
      const success = await patchMyObjectiveData(username, { mission });
  
      if (success) {
        alert("Perustehtävä tallennettu: " + mission);
        setIsEditing(false); // Exit editing mode after saving
      } else {
        alert("Tallennus epäonnistui. Yritä uudelleen.");
      }
    } catch (error) {
      console.error("Error saving mission:", error);
      alert("Tapahtui virhe tallennuksen aikana.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Oma päämäärä - mitä minä haluan saavuttaa työelämässä</h2>
        {(!isEditing && viewMode === "show all") && (
          <button
            onClick={() => {
              setIsEditing(true);
              setViewMode("myMission")
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Muokkaa
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {/* Mission Content */}
        {isEditing ? (
          <div className="flex-grow">
            <textarea
              value={mission}
              onChange={handleMissionChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleSaveMission();
                  setIsEditing(false); // Exit editing mode after saving
                  setViewMode("show all"); // Reset view mode to show all 
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Tallenna
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setViewMode("show all"); // Reset view mode to show all
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Peruuta
              </button>
            </div>
          </div>
        ) : (
          <p className="w-full p-2 border border-gray-300 rounded mb-4">
            {mission}
          </p>
        )}
      </div>
    </div>
  );
};

export default MyMission;
