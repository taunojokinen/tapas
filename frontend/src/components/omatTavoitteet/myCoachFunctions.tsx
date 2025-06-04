import React, { useEffect, useState, useRef } from "react";
import { ViewMode } from "../../types/enums";

interface MyCoachAiAnswerProps {
  viewMode: ViewMode;
  title: string;
  mission: string;
  setMission: (mission: string) => void;
}

function extractJsonArray(
  text: string
): { otsikko: string; kuvaus: string }[] | null {
  try {
    // Try direct parse first
    if (text.trim().startsWith("[")) {
      return JSON.parse(text);
    }
    // Try to extract JSON array from text
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch {
    // ignore
  }
  return null;
}

const MyCoachAiAnswer: React.FC<MyCoachAiAnswerProps> = ({
  viewMode,
  title,
  setMission,
  mission,
}) => {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (viewMode === ViewMode.MyMission && title && !requested.current) {
      requested.current = true;
      let aiQuestion = `Olen ${title}. Tee minulle neljä erilaista kuvausta urapäämääristäni viiden vuoden aikajänteellä. 
      Ensimmäisen kuvauksen tulisi painottaa työtä ihmisten kanssa esimeistehtävissä. Neljännen tulisi painottaa asiantuntijaosaamista. 
      toinen ja kolmas olisivat näiden välillä. Keksi kuvauksille nokkelat kahden sanan otsikot. 
      Vastaa Json muodossa [{"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"},{"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"},
      {"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"},{"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"}]`;

      // Add mission if longer than 20 characters
      if (mission && mission.length > 20) {
        aiQuestion += ` Nykyinen tavoitteeni: "${mission}".`;
      }

      const fetchAiResponse = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/mycoachai/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: aiQuestion }),
          });
          const data = await res.json();
          setAiResponse(data.answer);
        } catch (error) {
          setAiResponse("Virhe haettaessa tekoälyvastausta.");
        }
      };
      fetchAiResponse();
    } else if (viewMode !== ViewMode.MyMission) {
      setAiResponse(null);
      requested.current = false;
    }
  }, [viewMode, title]);

  if (viewMode !== ViewMode.MyMission) return null;

  const parsed = aiResponse ? extractJsonArray(aiResponse) : null;

  return (
    <div>
      {parsed ? (
        <div>
          {parsed.map((item, idx) => (
            <div key={idx} className="flex flex-row items-start mb-4 gap-3">
              <div>
                <div className="font-semibold">{item.otsikko}</div>
                <div>{item.kuvaus}</div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                onClick={() => setMission(`${item.otsikko} - ${item.kuvaus}`)}
              >
                Valitse
              </button>
            </div>
          ))}
        </div>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {aiResponse || "Haetaan tekoälyvastausta..."}
        </pre>
      )}
    </div>
  );
};

export default MyCoachAiAnswer;
