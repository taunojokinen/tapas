import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

enum rolesForAI {
  ChiefFinancialOfficer = "Chief Financial Officer",
  DirectorOfMarketing = "Director of Marketing",
  PersonnelManager = "Personnel Manager",
  QualityManager = "Quality Manager",
}

const initialValueProposal = [
  {
    nimi: "Taloudellinen vastuullisuus",
    kuvaus:
      "Pyrimme varmistamaan yrityksen kestävän taloudellisen kasvun ja resurssien tehokkaan käytön, jotta voimme tarjota pitkäaikaista arvoa asiakkaillemme, työntekijöillemme ja sidosryhmillemme.",
  },
  {
    nimi: "Tuloskeskeisyys",
    kuvaus:
      "Keskitymme tavoitteiden saavuttamiseen ja liiketoiminnan tulosten parantamiseen, jotta voimme jatkuvasti ylittää odotukset ja pysyä kilpailukykyisinä markkinoilla.",
  },
  {
    nimi: "Läpinäkyvyys",
    kuvaus:
      "Toimimme avoimesti ja rehellisesti kaikissa taloudellisissa prosesseissamme, jotta voimme rakentaa luottamusta asiakkaidemme, työntekijöidemme ja sijoittajiemme keskuudessa.",
  },
];

interface Values {
  tärkeys: number;
  nimi: string;
  kuvaus: string;
  _id: string;
}

const ChangeValues: React.FC = () => {
  const [values, setValues] = useState<Values[]>([]); // Yrityksen arvot
  const [valueProposal, setValueProposal] = useState(initialValueProposal);
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

  const fetchInitialValueProposal = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/generate-proposals`,
        {
          prompt: "Generate a list of company values with descriptions.",
        }
      );
      setValueProposal(response.data.proposals); // Assuming the API returns an array of proposals
    } catch (error) {
      console.error("Error fetching AI-generated proposals:", error);
    }
  };
  useEffect(() => {
    fetchInitialValueProposal();
  }, []);

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
      kuvaus: "Kuvaus uudelle arvolle",
      _id: Math.random().toString(36).substr(2, 9), // Generate a random ID
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
              <div key={value._id || index} className="mb-4 flex items-center gap-4">
        {/* Buttons in a row */}
        <div className="flex items-center gap-2">
          {/* Up Arrow */}
          <button
            onClick={() => handleMoveValue(index, "up")}
            disabled={index === 0} // Disable for the first item
            className={`px-2 py-1 rounded ${
              index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            ⬆️
          </button>
          {/* Down Arrow */}
          <button
            onClick={() => handleMoveValue(index, "down")}
            disabled={index === values.length - 1} // Disable for the last item
            className={`px-2 py-1 rounded ${
              index === values.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            ⬇️
          </button>
                  {/* Remove Button */}
        <button
          onClick={() => handleRemoveValue(index)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
           🗑️
        </button>
        </div>
                <p className="text-lg font-bold">{index+1} {value.nimi}</p>
                <p className="text-sm">{value.kuvaus}</p>
                <p className="text-sm text-gray-500">
                </p>
              </div>
            ))
          ) : (
            <p>Ei arvoja näytettäväksi.</p>
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

      {/* Render valueProposal below the heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          {rolesForAI.ChiefFinancialOfficer} ehdottaa uusia arvoja
        </h2>{valueProposal.map((proposal, index) => (
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
  ))}
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
