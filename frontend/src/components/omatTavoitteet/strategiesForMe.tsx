import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCompanyObjectives } from "../../hooks/useCompanyObjectives";
import MyCoachAiAnswer from "./MyCoachAiAnswer";
import { AiTavoite } from "./MyCoachAiAnswer";

interface TeamObjective {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  mission: string;
}
interface StrategiesForMeProps {
  setValitutEhdotukset: (ehdotukset: AiTavoite[]) => void;
}

const StrategiesForMe: React.FC<StrategiesForMeProps> = ({
  setValitutEhdotukset,
}) => {
  const [teamObjectives, setTeamObjectives] = useState<TeamObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { avainstrategiat } = useCompanyObjectives();
  const [valitutStrategiat, setValitutStrategiat] = useState<string[]>([]);
  const [valitutTavoitteet, setValitutTavoitteet] = useState<string[]>([]);
  const [naytaAi, setNaytaAi] = useState(false);

  const userId = localStorage.getItem("username");

 useEffect(() => {
  if (!userId) return;

  // Log the full request URL
axios.interceptors.request.use(request => {
  // If the URL is relative, combine with window.location.origin for logging
  const fullUrl = request.url?.startsWith("http")
    ? request.url
    : `${window.location.origin}${request.url}`;
  console.log("Axios request URL:", fullUrl);
  return request;
});

  const fetchData = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${API_BASE_URL}/api/teamobjectives/user/${userId}`);
      console.log("Fetched team objectives:", res);

      setTeamObjectives(res.data);
    } catch (err) {
      setError("Virhe haettaessa tiimejä ja tavoitteita");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [userId]);

  if (loading) return <p>Ladataan...</p>;
  if (error) return <p>{error}</p>;

  const toggleStrategia = (tavoite: string) => {
    setValitutStrategiat((prev) =>
      prev.includes(tavoite)
        ? prev.filter((s) => s !== tavoite)
        : [...prev, tavoite]
    );
  };

  const toggleMission = (mission: string) => {
    setValitutTavoitteet((prev) =>
      prev.includes(mission)
        ? prev.filter((m) => m !== mission)
        : [...prev, mission]
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="grid grid-cols-[30%_60%_auto] gap-6 items-start">
        {/* Avainstrategiat */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-4">Yrityksen Avainstrategiat</h2>
          {avainstrategiat.map((s, i) => (
            <div key={i} className="flex items-center justify-between mb-2">
              <span>{s.tavoite}</span>
              <input
                type="checkbox"
                checked={valitutStrategiat.includes(s.tavoite)}
                onChange={() => toggleStrategia(s.tavoite)}
              />
            </div>
          ))}
        </div>

        {/* Tiimit ja tavoitteet */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-4">Tiimit ja tavoitteet</h2>
          {teamObjectives.length === 0 ? (
            <p>Et kuulu yhteenkään tiimiin.</p>
          ) : (
            teamObjectives.map((team) => (
              <div
                key={team._id}
                className="mb-4 p-4 bg-gray-50 border rounded"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <span className="font-semibold">{team.name}</span>
                    <span className="text-sm text-gray-500">
                      ({team.owner === userId ? "Omistaja" : "Jäsen"})
                    </span>
                  </div>
                  <div className="flex-1 text-gray-700">{team.mission}</div>
                  <input
                    type="checkbox"
                    checked={valitutTavoitteet.includes(team.mission)}
                    onChange={() => toggleMission(team.mission)}
                    className="ml-4"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Button oikeassa reunassa samalla rivillä */}
        <div className="self-start">
          <button
            onClick={() => {
              console.log("Valitut avainstrategiat:", valitutStrategiat);
              console.log("Valitut tiimien tavoitteet:", valitutTavoitteet);
              setNaytaAi(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Käytä valittuja strategioita omien tavoite-ehdotusten luomiseen
          </button>
        </div>
      </div>

      {/* AI-vastaus alla */}
      {naytaAi && (
        <div className="mt-6">
          <MyCoachAiAnswer
            valitutStrategiat={valitutStrategiat}
            valitutTavoitteet={valitutTavoitteet}
            onValitutMuuttuu={setValitutEhdotukset}
          />
        </div>
      )}
    </div>
  );
};

export default StrategiesForMe;
