import React, { useState } from "react";
import { patchMyObjectiveData } from "./myObjectiveFunctions";
import type { MyMissionType } from "../../types/types";
import { ViewMode } from "../../types/enums";
import MyCoachAiAnswer from "./myCoachFunctions";


interface MyMissionProps {
  mission: MyMissionType;
  setMission: React.Dispatch<React.SetStateAction<MyMissionType>>;
  username: string;
  title: string;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}

const MyMission: React.FC<MyMissionProps> = ({
  mission,
  setMission,
  username,
  title,
  viewMode,
  setViewMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMission((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMission = async () => {
    try {
      const success = await patchMyObjectiveData(username, { mission });
      if (success) {
        alert("Perustehtävä tallennettu: " + mission.otsikko);
        setIsEditing(false);
      } else {
        alert("Tallennus epäonnistui. Yritä uudelleen.");
      }
    } catch (error) {
      console.error("Error saving mission:", error);
      alert("Tapahtui virhe tallennuksen aikana.");
    }
  };

  const handleHaeClick = () => {
    setViewMode(ViewMode.MyMissionWithAi);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold mb-4">
          Oma päämäärä - mitä minä haluan saavuttaa työelämässä
        </h2>

        {!isEditing && viewMode === ViewMode.ShowAll && (
          <button
            onClick={() => {
              setIsEditing(true);
              setViewMode(ViewMode.MyMission);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Muokkaa
          </button>
        )}
      </div>
      {isEditing &&
        (viewMode === ViewMode.MyMission ||
          viewMode === ViewMode.MyMissionWithAi) && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold">
              Haluatko ehdotuksia Micco McVirtaselta
            </span>
            {viewMode === ViewMode.MyMission && (
              <button
                onClick={handleHaeClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                hae
              </button>
            )}
          </div>
        )}

      <div className="flex-1">
        {/* Show coachTexts for other modes, or AI answer for MyMission */}

        {viewMode === ViewMode.MyMissionWithAi && (
          <MyCoachAiAnswer
            viewMode={viewMode}
            title={title}
            mission={mission ?? ""}
            setMission={setMission}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        {isEditing ? (
          <div className="flex flex-row gap-4">
            <div className="flex-shrink-0 w-32">
              {mission.img && (
                <img
                  src={mission.img}
                  alt="Mission preview"
                  className="max-h-32 max-w-32 object-cover rounded"
                />
              )}
            </div>
            <div className="flex flex-col flex-grow">
              <input
                type="text"
                name="otsikko"
                value={mission.otsikko}
                onChange={handleChange}
                placeholder="Otsikko"
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <textarea
                name="kuvaus"
                value={mission.kuvaus}
                onChange={handleChange}
                placeholder="Kuvaus"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                rows={4}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleSaveMission();
                    setIsEditing(false);
                    setViewMode(ViewMode.ShowAll);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Tallenna
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setViewMode(ViewMode.ShowAll);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Peruuta
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full p-2 border border-gray-300 rounded mb-4">
            <div className="flex flex-row items-start gap-4">
              {mission.img ? (
                <img
                  src={mission.img}
                  alt="Mission"
                  className="mb-2 max-h-32 max-w-32 object-cover rounded"
                />
              ) : (
                <div
                  className="mb-2 max-h-32 max-w-32 flex items-center justify-center bg-gray-100 text-gray-400 rounded"
                  style={{ height: 128, width: 128 }}
                >
                  Haetaan kuvaa...
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-lg mb-2">{mission.otsikko}</h3>
                <p>{mission.kuvaus}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMission;
