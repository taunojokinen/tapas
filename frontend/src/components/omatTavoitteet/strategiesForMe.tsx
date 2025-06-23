import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCompanyObjectives } from "../../hooks/useCompanyObjectives";
import MyObjectivesAiAnswer from "./myObjectivesAiAnswer";
import { AiTavoite } from "./myObjectivesAiAnswer";
import { ViewMode } from "../../types/enums";

import type { Team } from "../../types/types";

interface StrategiesForMeProps {
  setValitutEhdotukset: (ehdotukset: AiTavoite[]) => void;
  viewMode?: ViewMode; // Optional prop to control view mode
  setViewMode?: (mode: ViewMode) => void; // Optional prop to set view mode
}

const StrategiesForMe: React.FC<StrategiesForMeProps> = ({
  setValitutEhdotukset,
  viewMode = ViewMode.ShowAll, // Default to ShowAll if not provided
  setViewMode = () => {}, // Default no-op function if not provided
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { avainstrategiat } = useCompanyObjectives();
  const [valitutStrategiat, setValitutStrategiat] = useState<string[]>([]);
  const [valitutTavoitteet, setValitutTavoitteet] = useState<string[]>([]);
  const [valitutTavoitteetNimet, setValitutTavoitteetNimet] = useState<
    string[]
  >([]);
  const [naytaAi, setNaytaAi] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("username");

  useEffect(() => {
    if (!userId) return;

    // Log the full request URL
    axios.interceptors.request.use((request) => {
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
        const res = await axios.get(
          `${API_BASE_URL}/api/teamobjectives/user/${userId}`
        );
        console.log("Fetched team objectives:", res);

        setTeams(res.data);
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

  const getSelectedObjectiveNames = () => {
    const allObjectives = teams.flatMap((team) => team.teamObjectives);
    return valitutTavoitteet
      .map((id) => allObjectives.find((obj) => obj._id === id)?.nimi)
      .filter(Boolean); // removes undefined
  };



  return (
    <div className="w-full py-6">
      {/* Added row for Micco McVirtanen suggestion */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xl font-bold">

          {viewMode === ViewMode.KeyObjectives
            ? "Haluatko ehdotuksia Micco McVirtaselta"
            : viewMode === ViewMode.KeyObjectivesWithAi
            ? "Valitse avainstrategiat ja tiimit"
            : viewMode === ViewMode.KeyObjectivesSelect
            ? "Valitse tiimit ja tavoitteet"
            :""}
        </span>
        <button
          onClick={() => {
            if (viewMode === ViewMode.KeyObjectives) {
              setViewMode(ViewMode.KeyObjectivesWithAi);
            } else if (viewMode === ViewMode.KeyObjectivesWithAi) {
              setViewMode(ViewMode.KeyObjectivesSelect);
            }
          }}

          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {viewMode === ViewMode.KeyObjectives ? "Haluan" : "Hae ehdotuklsia"}
        </button>
      </div>
      {viewMode === ViewMode.KeyObjectivesWithAi && (
        <div className="grid grid-cols-[30%_60%_auto] gap-6 items-start">
          {/* Avainstrategiat */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-xl font-bold mb-4">
              Yrityksen Avainstrategiat
            </h2>
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

            {teams.length === 0 ? (
              <p>Et kuulu yhteenkään tiimiin.</p>
            ) : (
              teams.map((team) => (
                <div
                  key={team._id}
                  className="mb-4 p-4 bg-gray-50 border rounded"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-[200px]">
                      <span className="font-semibold">{team.name}</span>
                      <span className="text-sm text-gray-500">
                        ({team.owner === userId ? "Omistaja" : "Jäsen"})
                      </span>
                      {/* List team objectives */}
                      {team.teamObjectives && team.teamObjectives.length > 0 ? (
                        <ul className="mt-2 list-disc list-inside">
                          {team.teamObjectives.map((objective) =>
                            objective._id ? (
                              <li
                                key={objective._id}
                                className="ml-2 flex items-center justify-between"
                              >
                                <span className="font-medium">
                                  {objective.nimi}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={valitutTavoitteet.includes(
                                    objective._id!
                                  )}
                                  onChange={() => toggleMission(objective._id!)}
                                  className="ml-4"
                                />
                              </li>
                            ) : null
                          )}
                        </ul>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Ei tavoitteita
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* AI-vastaus alla */}
      {viewMode === ViewMode.KeyObjectivesSelect  && (
        <div className="mt-6">
          <MyObjectivesAiAnswer
            valitutStrategiat={valitutStrategiat}
            valitutTavoitteetNimet={valitutTavoitteetNimet}
            onValitutMuuttuu={setValitutEhdotukset}
            onAiAnswerReady={() => setViewMode(ViewMode.KeyObjectivesSelect)}
          />
        </div>
      )}
    </div>
  );
};

export default StrategiesForMe;
