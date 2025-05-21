// hooks/useCompanyObjectives.ts
import { useEffect, useState } from "react";
import { Strategia } from "../types/types";

export const useCompanyObjectives = () => {
  const [perustehtava, setPerustehtava] = useState<string[]>([]);
  const [paamaara, setPaamaara] = useState<string[]>([]);
  const [avainstrategiat, setAvainstrategiat] = useState<Strategia[]>([]);
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);
  const [viesti, setViesti] = useState<string | null>(null);
  const [viimeisin, setViimeisin] = useState<any>(null);

  useEffect(() => {
    const haeTiedot = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || ""}/api/companyObjectives`
        );
        if (response.ok) {
          const data = await response.json();
          const viimeisin = data[data.length - 1];
          setViimeisin(viimeisin);
          console.log("viimeisin: ", viimeisin);

          setPerustehtava(viimeisin.perustehtava || []);
          setPaamaara(viimeisin.paamaara || []);
          setAvainstrategiat(
            (viimeisin.avainstrategiat || []).map((s: any) => ({
              tavoite: s.tavoite || "",
              toimenpide: s.toimenpide || "",
              seuranta: s.seuranta || "green",
            }))
          );

          setPros(viimeisin.nykytila?.pros || []);
          setCons(viimeisin.nykytila?.cons || []);
        }
      } catch (err) {
        setViesti("Virhe tietojen haussa");
      }
    };

    haeTiedot();
  }, []);

  const tallennaTiedot = async () => {
    setViesti(null);

    const method = viimeisin?._id ? "PUT" : "POST";
    const url = viimeisin?._id
      ? `${process.env.REACT_APP_API_URL || ""}/api/companyObjectives/${
          viimeisin._id
        }`
      : `${process.env.REACT_APP_API_URL || ""}/api/companyObjectives`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perustehtava,
          paamaara,
          avainstrategiat,
          nykytila: { pros, cons },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tallennus epäonnistui");
      }

      setViesti("Tiedot tallennettu onnistuneesti.");
    } catch (err: any) {
      setViesti(`Virhe tallennuksessa: ${err.message}`);
    }
  };

  return {
    perustehtava,
    setPerustehtava,
    paamaara,
    setPaamaara,
    avainstrategiat,
    setAvainstrategiat,
    pros,
    setPros,
    cons,
    setCons,
    viesti,
    tallennaTiedot,
  };
};
