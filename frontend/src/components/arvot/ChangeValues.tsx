import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

enum rolesForAI {
  ChiefFinancialOfficer = "Chief Financial Officer",
  DirectorOfMarketing = "Director of Marketing",
  PersonnelManager = "Personnel Manager",
  QualityManager = "Quality Manager"
}

const initialValueProposal = [{"Nimi": "Taloudellinen vastuullisuus",
  "Kuvaus": "Pyrimme varmistamaan yrityksen kestävän taloudellisen kasvun ja resurssien tehokkaan käytön, jotta voimme tarjota pitkäaikaista arvoa asiakkaillemme, työntekijöillemme ja sidosryhmillemme."
},
{  "Nimi": "Tuloskeskeisyys",
  "Kuvaus": "Keskitymme tavoitteiden saavuttamiseen ja liiketoiminnan tulosten parantamiseen, jotta voimme jatkuvasti ylittää odotukset ja pysyä kilpailukykyisinä markkinoilla."
},  
{  "Nimi": "Läpinäkyvyys",
  "Kuvaus": "Toimimme avoimesti ja rehellisesti kaikissa taloudellisissa prosesseissamme, jotta voimme rakentaa luottamusta asiakkaidemme, työntekijöidemme ja sijoittajiemme keskuudessa."
}]

interface Arvo {
    nimi: string;
    kuvaus: string;
    tärkeys: number;
  }

  interface Arvot {
    _id: string;
    arvot: Arvo[];
  }
  
  interface YritysArvot {
    _id: string;
    yritys: string;
    arvot: Arvo[];
  }


const ChangeValues: React.FC = () => {
    const [kaikkiArvot, setKaikkiArvot] = useState<YritysArvot[]>([]); // Kaikki arvot tietokannasta
    const [yritys, setYritys] = useState<string>("Yritys"); // Yrityksen nimi
    const [arvot, setArvot] = useState<Arvot[]>([]); // Yrityksen arvot
    const [valueProposal, setValueProposal] = useState(initialValueProposal); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate(); // Initialize useNavigate
  
    /** 🔄 Haetaan yrityksen arvot tietokannasta */
    const fetchArvot = React.useCallback(async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/arvot`);
    
          // Varmistetaan, että data on taulukko
          const data = Array.isArray(response.data) ? response.data : [];
          setKaikkiArvot(data);
          setYritys(data[0]?.yritys || ""); // Asetetaan yrityksen nimi ensimmäisestä arvosta
          setArvot(data[0].arvot); // Asetetaan arvot ensimmäisestä arvosta
          console.log("Arvot:", arvot); // Log arvot
          setLoading(false);
        } catch (err) {
          setError("Tietojen hakeminen epäonnistui.");
          console.error("Virhe:", err);
          setLoading(false);
        }
      }, [arvot]);
  /** ⏳ Haetaan arvot **vain kerran** kun komponentti renderöityy */
  useEffect(() => {
    fetchArvot();
  }, [fetchArvot]);

  useEffect(() => {
    console.log("Updated arvot:", arvot);
  }, [arvot]);

    /** Navigate back to the Arvot page */
    const handleBack = () => {
        navigate("/arvot"); // Navigate to the Arvot page
      };

        /** Remove a proposal from the list */
  const handleRemoveProposal = (proposalName: string) => {
    setValueProposal((prevProposals) =>
      prevProposals.filter((proposal) => proposal.Nimi !== proposalName)
    );
  };

  const handleAcceptProposal = (proposalName: string) => {
    const selectedProposal = valueProposal.find(
      (proposal) => proposal.Nimi === proposalName
    );
  
    if (!selectedProposal) return;
  
    // Ask the user which value to replace
    const indexToReplace = prompt(
      "Minkä arvon haluat korvata? Anna arvojen numero (1, 2, 3, ...):"
    );
  
    if (indexToReplace) {
      const index = parseInt(indexToReplace) - 1; // Convert to zero-based index
      if (isNaN(index) || index < 0 || index >= kaikkiArvot[0]?.arvot.length) {
        alert("Virheellinen numero. Yritä uudelleen.");
        return;
      }
  
      // Replace the selected value in kaikkiArvot
      setKaikkiArvot((prevKaikkiArvot) =>
        prevKaikkiArvot.map((yritys) => ({
          ...yritys,
          arvot: yritys.arvot.map((arvo, i) =>
            i === index
              ? {
                  ...arvo,
                  nimi: selectedProposal.Nimi,
                  kuvaus: selectedProposal.Kuvaus,
                }
              : arvo
          ),
        }))
      );
  
      alert(`Arvo ${index + 1} korvattiin onnistuneesti.`);
    }
  };

  const updateValues = async () => {
    try {
      // Send updated values to the backend
      const jsonData = { arvot };
      console.log("Päivitetyt arvot:", jsonData); // Log the updated values
      await axios.put(`${process.env.REACT_APP_API_URL}/api/arvot`, jsonData);
  
      alert("Arvot päivitettiin onnistuneesti!");
    } catch (err) {
      console.error("Virhe arvotietojen päivittämisessä:", err);
      alert("Arvojen päivittäminen epäonnistui. Yritä uudelleen.");
    }
  };
console.log(arvot); // Log the company name
  return (

        // <div className="w-screen h-screen bg-blue-100 flex flex-col items-center justify-center">
        <div className="relative bg-blue-300 w-[70vw] h-[70vh] rounded-2xl p-4">
    <div
      className="absolute bg-white w-[calc(70vw-2rem)] h-[calc(70vh-2rem)] rounded-2xl p-4
      "
    >
            <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT yritykselle {yritys} </h1>
            <p>{kaikkiArvot[0].arvot[]}</p>

            {/* Render valueProposal below the heading */}
<div className="mb-6">
  {valueProposal.map((proposal, index) => (
    <div key={index} className="mb-4">
      <p className="text-lg font-bold">{proposal.Nimi}</p>
      <p className="text-sm">{proposal.Kuvaus}</p>

            {/* Buttons for each proposal */}
            <div className="flex gap-2 mt-2">
        <button
          onClick={() => handleAcceptProposal(proposal.Nimi)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Hyväksy ehdotus
        </button>
        <button
          onClick={() => handleRemoveProposal(proposal.Nimi)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Poista ehdotus
        </button>
        </div>
    </div>
  ))}
</div>
{arvot && arvot.length > 0 ? (
  arvot.map((arvotItem) =>
    arvotItem.arvot && arvotItem.arvot.map((arvo, index) => (
      <div key={index} className="mb-4">
        <p className="text-lg font-bold">Arvo {index + 1} - {arvo.nimi}</p>
        <p className="text-sm">{arvo.kuvaus}</p>
        <p className="text-sm">Heikki Hei!</p>
      </div>
    ))
  )
) : (
  <p className="text-gray-500">Ei arvoja näytettäväksi.</p>
)}
          </div>
        {/* </div> */}
        <div className="mt-4">
          {loading ? (
            <p>Ladataan...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Data loaded successfully!</p>
          )}
    </div>
    {/* Back Button */}
    <div className="absolute bottom-4 right-4">
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Palaa päivittämättä arvoja
      </button>
    </div>
    {/* Päivitä arvot Button */}
<div className="absolute bottom-4 left-4">
  <button
        onClick={updateValues}
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
  >
    Päivitä arvot
  </button>
</div>
    
  </div>
      );
};

export default ChangeValues;