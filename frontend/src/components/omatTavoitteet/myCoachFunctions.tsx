import React, { useEffect, useState, useRef } from "react";
import { ViewMode, ImageLoadingState } from "../../types/enums";
import McVirtanen from "../../pictures/McVirtanen.jpg";
import { MyMissionType } from "../../types/types";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

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
    if (text.trim().startsWith("[")) {
      return JSON.parse(text);
    }
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch {
    // ignore
  }
  return null;
}

async function getDallePromptFromAI(
  otsikko: string,
  kuvaus: string
): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/mycoachai/ask`, {
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
  const [aiMessage, setAiMessage] = useState("Haetaan tekoälyvastausta...");
  const [imageLoadingState, setImageLoadingState] = useState<ImageLoadingState>(
    ImageLoadingState.LoadingDone
  );
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [parsed, setParsed] = useState<
    { otsikko: string; kuvaus: string }[] | null
  >(null);
  const [dallePrompts, setDallePrompts] = useState<(string | null)[]>([]);
  const [dalleImages, setDalleImages] = useState<(string | null)[]>([]);
  const requested = useRef(false);

  useEffect(() => {
    if (viewMode === ViewMode.MyMissionWithAi && title && !requested.current) {
      requested.current = true;
      setImageLoadingState(ImageLoadingState.LoadingDescriptions);
      let aiQuestion = `Olen ${title}. Tee minulle neljä erilaista kuvausta urapäämääristäni viiden vuoden aikajänteellä. 
      Ensimmäisen kuvauksen tulisi painottaa työtä ihmisten kanssa esimeistehtävissä. Neljännen tulisi painottaa asiantuntijaosaamista. 
      toinen ja kolmas olisivat näiden välillä. Keksi kuvauksille nokkelat kahden sanan otsikot. 
      Vastaa Json muodossa [{"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"},{"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"},
      {"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"},{"otsikko":"kaksi sanaa", "kuvaus":"100 sanaa"}]`;

      if (mission?.kuvaus && mission.kuvaus.length > 20) {
        aiQuestion += ` Nykyinen tavoitteeni: "${mission.kuvaus}".`;
      }

      const fetchAiResponse = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/mycoachai/ask`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ question: aiQuestion }),
            }
          );
          const data = await res.json();
          setAiResponse(data.answer);
        } catch (error) {
          setAiResponse("Virhe haettaessa tekoälyvastausta.");
          setImageLoadingState(ImageLoadingState.LoadingDone);
        }
      };
      fetchAiResponse();
    } else if (viewMode !== ViewMode.MyMission) {
      setAiResponse(null);
      requested.current = false;
      setImageLoadingState(ImageLoadingState.LoadingDone);
    }
  }, [viewMode, title, mission]);

  useEffect(() => {
    if (aiResponse) {
      const parsedResult = extractJsonArray(aiResponse);
      setParsed(parsedResult);
      if (parsedResult) {
        setImageLoadingState(ImageLoadingState.PlanningImage);
      }
    } else {
      setParsed(null);
    }
  }, [aiResponse]);

  useEffect(() => {
    if (parsed) {
      setImageLoadingState(ImageLoadingState.PlanningImage);
      Promise.all(
        parsed.map((item, idx) => {
          return getDallePromptFromAI(item.otsikko, item.kuvaus).catch(
            () => null
          );
        })
      ).then((prompts) => {
        setDallePrompts(prompts);
        setImageLoadingState(ImageLoadingState.DrawingImage);
      });
    } else {
      setDallePrompts([]);
    }
  }, [parsed]);

  useEffect(() => {
    if (dallePrompts.length > 0) {
      setImageLoadingState(ImageLoadingState.DrawingImage);
      Promise.all(
        dallePrompts.map((prompt) =>
          prompt
            ? fetch(
                `${API_BASE_URL}/api/mycoachai/picture`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt }),
                }
              )
                .then((res) => res.json())
                .then((data) => data.imageUrl || null)
                .catch(() => null)
            : Promise.resolve(null)
        )
      ).then((images) => {
        setDalleImages(images);
        setImageLoadingState(ImageLoadingState.LoadingDone);
      });
    } else {
      setDalleImages([]);
      setImageLoadingState(ImageLoadingState.LoadingDone);
    }
  }, [dallePrompts]);

  if (viewMode !== ViewMode.MyMissionWithAi) return null;

  return (
    <div>
      {imageLoadingState !== ImageLoadingState.LoadingDone ? (
        <div className="mb-4 text-gray-600">
          {imageLoadingState === ImageLoadingState.LoadingDescriptions &&
            "Haetaan tekoälykuvauksen vaihtoehtoja..."}
          {imageLoadingState === ImageLoadingState.PlanningImage &&
            "Suunnitellaan kuvaa..."}
          {imageLoadingState === ImageLoadingState.DrawingImage &&
            "Piirretään kuvaa..."}
        </div>
      ) : parsed ? (
        <div>
          {parsed.map((item, idx) => (
            <div key={idx} className="flex flex-row items-start mb-4 gap-3">
              <img
                src={dalleImages[idx] || mission.img || McVirtanen}
                alt="Coach"
                className="w-20 h-20 object-cover rounded-full mt-1"
                style={{ flexShrink: 0 }}
              />
              <div>
                <div className="font-semibold">{item.otsikko}</div>
                <div>{item.kuvaus}</div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                onClick={() =>
                  setMission({
                    otsikko: item.otsikko,
                    kuvaus: item.kuvaus,
                    img: dalleImages[idx] || mission.img || McVirtanen,
                  })
                }
              >
                Valitse
              </button>
            </div>
          ))}
        </div>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>{aiMessage}</pre>
      )}
    </div>
  );
};

export default MyCoachAiAnswer;
