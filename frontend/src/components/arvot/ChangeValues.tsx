import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Values, Proposal } from "../../types/types";
import { fetchValueProposals } from "./AIProposals";


const rolesForAI = [
  "Chief Financial Officer",
  "Director of Marketing",
  "Personnel Manager",
  "Quality Manager",
]

const initialValueProposal: Proposal[] = [
  {
    nimi: "Taloudellinen vastuullisuus",
    kuvaus: "Pyrimme varmistamaan yrityksen kestävän taloudellisen kasvun ja resurssien tehokkaan käytön, jotta voimme tarjota pitkäaikaista arvoa asiakkaillemme, työntekijöillemme ja sidosryhmillemme.",
    role: undefined, // Add role as undefined
  },
  {
    nimi: "Tuloskeskeisyys",
    kuvaus: "Keskitymme tavoitteiden saavuttamiseen ja liiketoiminnan tulosten parantamiseen, jotta voimme jatkuvasti ylittää odotukset ja pysyä kilpailukykyisinä markkinoilla.",
    role: undefined,
  },
  {
    nimi: "Läpinäkyvyys",
    kuvaus: "Toimimme avoimesti ja rehellisesti kaikissa taloudellisissa prosesseissamme, jotta voimme rakentaa luottamusta asiakkaidemme, työntekijöidemme ja sijoittajiemme keskuudessa.",
    role: undefined,
  },
];




const ChangeValues: React.FC = () => {
  const [values, setValues] = useState<Values[]>([]); // Yrityksen arvot
  const [valueProposal, setValueProposal] = useState(initialValueProposal);
  const [roleIndex, setRoleIndex] = useState(0); // Index for rolesForAI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Initialize useNavigate

  /** 🔄 Haetaan yrityksen arvot tietokannasta */
  const fetchArvot = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/values`
      );

      // Varmistetaan, että data on taulukko
      const data = Array.isArray(response.data) ? response.data : [];
      setValues(data);

      console.log("Arvot:", values); // Log arvot
      setLoading(false);
    } catch (err) {
      setError("Tietojen hakeminen epäonnistui.");
      console.error("Virhe:", err);
      setLoading(false);
    }
  }, []);
  /** ⏳ Haetaan arvot **vain kerran** kun komponentti renderöityy */
  useEffect(() => {
    fetchArvot();
  }, [fetchArvot]);

  /** Navigate back to the Arvot page */
  const handleBack = () => {
    navigate("/arvot"); // Navigate to the Arvot page
  };

/** Fetch 3 value proposals from AI */

const handleFetchProposals = async () => {
  try {
    setLoading(true);
    const proposals = await fetchValueProposals();
    setValueProposal(proposals);
    alert("Kaikki arvoehdotukset haettu onnistuneesti!");
  } catch (error) {
    console.error("Virhe arvoehdotusten hakemisessa AI:lta:", error);
    alert("Arvoehdotusten hakeminen epäonnistui. Yritä uudelleen.");
  } finally {
    setLoading(false);
  }
};
const valueProposals = async () => {
  try {
    setLoading(true); // Start loading
    const allProposals: Proposal[] = [];

    for (let i = 0; i < rolesForAI.length; i++) {
      const response = await axios.post("http://localhost:5000/api/ai/generate-proposals", {
        prompt: `Have a strict role of "${rolesForAI[i]}". Generate a list of three company values with descriptions. Keep strong focus in your role. Answer in Finnish. Answer as a JSON with header arvot: and two parameters nimi: and kuvaus:`
      });

      if (response.data && Array.isArray(response.data.proposals)) {
        allProposals.push(...response.data.proposals.map((proposal: Proposal) => ({
          ...proposal,
          role: rolesForAI[i], // Add the role to each proposal
        })));
      } else {
        throw new Error(`Virheellinen vastaus AI:lta roolille: ${rolesForAI[i]}`);
      }
    }

    setValueProposal(allProposals);
    alert("Kaikki arvoehdotukset haettu onnistuneesti!");
  } catch (error) {
    console.error("Virhe arvoehdotusten hakemisessa AI:lta:", error);
    alert("Arvoehdotusten hakeminen epäonnistui. Yritä uudelleen.");
  } finally {
    setLoading(false); // Stop loading
  }
};

  /** Remove a proposal from the list */
  const handleRemoveProposal = (proposalName: string) => {
    setValueProposal((prevProposals) =>
      prevProposals.filter((proposal) => proposal.nimi !== proposalName)
    );
  };

  const handleAcceptProposal = (proposalName: string) => {
    const selectedProposal = valueProposal.find(
      (proposal) => proposal.nimi === proposalName
    );

    if (!selectedProposal) return;

    // Ask the user which value to replace
    const indexToReplace = prompt(
      "Minkä arvon haluat korvata? Anna arvojen numero (1, 2, 3, ...):"
    );

    if (indexToReplace) {
      const index = parseInt(indexToReplace) - 1; // Convert to zero-based index
      if (isNaN(index) || index < 0 || index >= values?.length) {
        alert("Virheellinen numero. Yritä uudelleen.");
        return;
      }

      // Replace the selected value
      setValues((prevValues) =>
        prevValues.map((arvo, i) =>
          i === index
            ? {
                ...arvo,
                nimi: selectedProposal.nimi,
                kuvaus: selectedProposal.kuvaus,
              }
            : arvo
        )
      );

      alert(`Arvo ${index + 1} korvattiin onnistuneesti.`);
    }
  };

  const updateValues = async () => {
    try {
      // Send updated values to the backend
      const jsonData = { values };
      console.log("Päivitetyt arvot:", jsonData); // Log the updated values
      await axios.put(`${process.env.REACT_APP_API_URL}/api/values`, jsonData);

      alert("Arvot päivitettiin onnistuneesti!");
    } catch (err) {
      console.error("Virhe arvotietojen päivittämisessä:", err);
      alert("Arvojen päivittäminen epäonnistui. Yritä uudelleen.");
    }
  };
  console.log(values); // Log the company name
  const handleMoveValue = (index: number, direction: "up" | "down") => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      const [movedValue] = newValues.splice(index, 1); // Remove the value at the current index
      const newIndex = direction === "up" ? index - 1 : index + 1; // Calculate the new index
      newValues.splice(newIndex, 0, movedValue); // Insert the value at the new index
      return newValues;
    });
  };
  
  /** Add a new value to the list */
  const handleAddValue = () => {
    const newValue: Values = {
      tärkeys: 0,
      nimi: "Uusi arvo",
      kuvaus: "Kuvaus uudelle arvolle"
    };
    setValues((prevValues) => [...prevValues, newValue]);
  };

  /** Remove a value from the list */
  const handleRemoveValue = (index: number) => {
    setValues((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT</h1>

      <div className="mt-6">
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Yrityksen nykyiset arvot</h2>
          {values.length > 0 ? (
            values.map((value, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                {/* Buttons in front of the row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveValue(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveValue(index, "down")}
                    disabled={index === values.length - 1}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleRemoveValue(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>

                {/* Value details */}
                <div>
                  <p className="text-lg font-bold">{value.nimi}</p>
                  <p className="text-sm">{value.kuvaus}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Ei arvoja saatavilla.</p>
          )}

<div className="mt-4">
    <button
      onClick={() => handleAddValue()}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Lisää arvo
    </button>
  </div>
        </div>
      </div>

      {/* Render valueProposal grouped by role */}
{/* Render valueProposal grouped by role */}
<div className="mb-6">
  {rolesForAI.map((role) => {
    const proposalsForRole = valueProposal.filter(
      (proposal) => proposal.role === role
    );

    return (
      <div key={role} className="mb-6">
        <h2 className="text-xl font-bold mb-4">{role} ehdottaa uusia arvoja</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Ladataan arvoehdotuksia...</p>
        ) : proposalsForRole.length > 0 ? (
          proposalsForRole.map((proposal, index) => (
            <div key={index} className="mb-4 flex items-center gap-4">
              {/* Buttons in front of the row */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptProposal(proposal.nimi)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  ✔️
                </button>
                <button
                  onClick={() => handleRemoveProposal(proposal.nimi)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>

              {/* Proposal details */}
              <div>
                <p className="text-lg font-bold">{proposal.nimi}</p>
                <p className="text-sm">{proposal.kuvaus}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Ei arvoehdotuksia saatavilla.</p>
        )}
      </div>
    );
  })}
</div>

{/* Back Button and Update Button Container */}
<div className="flex justify-between mt-8">
  {/* Back Button */}
  <button
    onClick={handleBack}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Palaa päivittämättä arvoja
  </button>

    {/* Lisää Arvoehdotuksia Button */}
    <button
    onClick={valueProposals}
    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
  >
    Lisää arvoehdotuksia
  </button>
  <button
        onClick={handleFetchProposals}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Lisää arvoehdotuksia - test
      </button>
  {/* Päivitä arvot Button */}
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
