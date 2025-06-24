import React, { useEffect, useState, useRef } from "react";
import { fetchUserTitlesByUsername } from "./myObjectiveFunctions";

function extractJsonArray(text: string): AiTavoite[] | null {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]) as AiTavoite[];
    }
  } catch (err) {
    console.error("JSON-parsinta epäonnistui:", err);
  }
  return null;
}

export interface AiTavoite {
  tavoite: string;
  mittari: string;
}

interface MyObjectivesAiAnswerProps {
  valitutStrategiat: string[];
  valitutTavoitteetNimet: string[];
  onValitutMuuttuu?: (valitut: AiTavoite[]) => void;
  onAiAnswerReady?: () => void;
}

const MyObjectivesAiAnswer: React.FC<MyObjectivesAiAnswerProps> = ({
  valitutStrategiat,
  valitutTavoitteetNimet,
  onValitutMuuttuu,
  onAiAnswerReady,
}) => {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [valitut, setValitut] = useState<AiTavoite[]>([]);
  const requested = useRef(false);

  useEffect(() => {
    const fetchAndSetTitle = async () => {
      const user = localStorage.getItem("username");
      if (user) {
        const titles = await fetchUserTitlesByUsername(user);
        if (titles && titles.length > 0) {
          setTitle(titles[0]);
        }
      }
    };

    fetchAndSetTitle();
  }, []);

  useEffect(() => {
    if (title && !requested.current) {
      requested.current = true;
      const aiQuestion = `Olen ${title}. Tee minulle kolme eri ehdotusta tavoitteikseni seuraavalle vuodelle valitsemiini
      valitutStrategiat ja valitutTavoitteet parametreihin perustuen. 
      Strategiat: ${valitutStrategiat.join(", ")}
      Tiimitavoitteet: ${valitutTavoitteetNimet.join(", ")}
      Vastaa pelkällä JSON-listalla muodossa:

[
  { "tavoite": "lyhyt kuvaus tavoitteesta", "mittari": "kuvaus siitä miten tavoite mitataan" },
  { "tavoite": "lyhyt kuvaus tavoitteesta", "mittari": "kuvaus siitä miten tavoite mitataan" },
  { "tavoite": "lyhyt kuvaus tavoitteesta", "mittari": "kuvaus siitä miten tavoite mitataan" }
]

Älä kirjoita muuta kuin puhdas JSON.`;

const fetchAiResponse = async () => {
  try {
    const url = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/mycoachai/ask`;
    const body = { question: aiQuestion };
    console.log("Requesting AI answer:", { url, body });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("AI response data:", data);

    setAiResponse(data.answer);
    if (onAiAnswerReady) onAiAnswerReady();
  } catch (error) {
    console.error("Error fetching AI answer:", error);
    setAiResponse("Virhe haettaessa tekoälyvastausta.");
  }
};

      fetchAiResponse();
    }
  }, [title, valitutStrategiat, valitutTavoitteetNimet, onAiAnswerReady]);

  const parsed = aiResponse ? extractJsonArray(aiResponse) : null;

  const toggleValinta = (item: AiTavoite) => {
    const onJoValittu = valitut.some(
      (v) => v.tavoite === item.tavoite && v.mittari === item.mittari
    );
    const uudet = onJoValittu
      ? valitut.filter(
          (v) => !(v.tavoite === item.tavoite && v.mittari === item.mittari)
        )
      : [...valitut, item];

    setValitut(uudet);
    onValitutMuuttuu?.(uudet); // Ilmoita yläkomponentille
  };

  return (
    <div>
      <p> MyCoachAnswer</p>
      {parsed ? (
        <div>
          {parsed?.map((item, idx) => {
            const isChecked = valitut.some(
              (v) => v.tavoite === item.tavoite && v.mittari === item.mittari
            );

            return (
              <div key={idx} className="flex items-start gap-3 mb-4">
                <p> MyCoachAnswer</p>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleValinta(item)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    {item.tavoite}
                  </div>
                  <div className="text-gray-600">{item.mittari}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {aiResponse || "Haetaan tekoälyvastausta..."}
        </pre>
      )}
    </div>
  );
};

export default MyObjectivesAiAnswer;
