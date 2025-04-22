import React from "react";
import { useNavigate } from "react-router-dom";
import { useMission } from "../context/MissionContext";

const ChangeMission: React.FC = () => {
  const { mission, setMission } = useMission();
  const navigate = useNavigate();

  const handleMissionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMission(event.target.value);
  };

  const handleSave = () => {
    alert("Perustehtävä tallennettu: " + mission);
    navigate("/omat_tavoitteet");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Muokkaa Perustehtävää</h2>
      <textarea
        value={mission}
        onChange={handleMissionChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        rows={6}
      />
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tallenna
      </button>
    </div>
  );
};

export default ChangeMission;