import React, { useEffect, useState, useRef } from "react";
import { ViewMode } from "../../types/enums";
import McVirtanen from "../../pictures/McVirtanen.jpg";
import { MyMissionType } from "../../types/types";

interface MyCoachAiAnswerProps {
  viewMode: ViewMode;
  title: string;
  mission: MyMissionType;
  setMission: (mission: MyMissionType) => void;
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

// Ask your AI to generate a DALL-E prompt for each description
async function getDallePromptFromAI(
  otsikko: string,
  kuvaus: string
): Promise<string> {
  const res = await fetch("http://localhost:5000/api/mycoachai/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: `Luo DALL-E:lle englanninkielinen kuvauskuvaus seuraavasta uratavoitteesta ja kuvauksesta, jotta 
      tekoäly osaa piirtää inspiroivan kuvan Kari Suomalaisen tyyliin. Otsikko: "${otsikko}". Kuvaus: "${kuvaus}".`,
    }),
  });
  const data = await res.json();
  return data.answer;
}

const MyCoachAiAnswer: React.FC<MyCoachAiAnswerProps> = ({
  viewMode,
  title,
  setMission,
  mission,
}) => {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [parsed, setParsed] = useState<
    { otsikko: string; kuvaus: string }[] | null
  >(null);
  const [dallePrompts, setDallePrompts] = useState<(string | null)[]>([]);
  const [dalleImages, setDalleImages] = useState<(string | null)[]>([]);
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
      if (mission?.kuvaus && mission.kuvaus.length > 20) {
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
  }, [viewMode, title, mission]);

  useEffect(() => {
    if (aiResponse) {
      const parsedResult = extractJsonArray(aiResponse);
      console.log("Parsed proposals:", parsedResult); // Should be an array of 4
      setParsed(extractJsonArray(aiResponse));
    } else {
      setParsed(null);
    }
  }, [aiResponse]);

  // Fetch DALL-E prompts for each parsed item
useEffect(() => {
  if (parsed) {
    Promise.all(
      parsed.map((item, idx) => {
        console.log(`Requesting DALL-E prompt for item ${idx}:`, item);
        return getDallePromptFromAI(item.otsikko, item.kuvaus).catch((err) => {
          console.error("DALL-E prompt fetch failed for:", item, err);
          return null;
        });
      })
    ).then((prompts) => {
      console.log("All DALL-E prompts:", prompts);
      setDallePrompts(prompts);
    });
  } else {
    setDallePrompts([]);
  }
}, [parsed]);

  useEffect(() => {
    if (dallePrompts.length > 0) {
      Promise.all(
        dallePrompts.map((prompt) =>
          prompt
            ? fetch("http://localhost:5000/api/mycoachai/picture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
              })
                .then((res) => res.json())
                .then((data) => data.imageUrl || null)
                .catch(() => null)
            : Promise.resolve(null)
        )
      ).then((images) => {
      console.log("All DALL-E images:", images);
      setDalleImages(images);
      });
    } else {
      setDalleImages([]);
    }
  }, [dallePrompts]);

  if (viewMode !== ViewMode.MyMission) return null;

  return (
    <div>
      {parsed ? (
        <div>
          {parsed.map((item, idx) => (
            <div key={idx} className="flex flex-row items-start mb-4 gap-3">
              <img
                src={dalleImages[idx] || McVirtanen}
                alt="Coach"
                className="w-20 h-20 object-cover rounded-full mt-1"
                style={{ flexShrink: 0 }}
              />
              <div>
                <div className="font-semibold">{item.otsikko}</div>
                <div>{item.kuvaus}</div>
                {/* <div style={{ fontStyle: "italic", color: "#888" }}>
                  {dallePrompts[idx] || "Haetaan DALL-E promptia..."}
                </div> */}
              </div>
<button
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
  onClick={() =>
    setMission({
      otsikko: item.otsikko,
      kuvaus: item.kuvaus,
      img: dalleImages[idx] || McVirtanen // add the required img property
    })
  }
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
