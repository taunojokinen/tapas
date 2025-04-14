import React, { useState , useEffect} from "react";
import axios from "axios";
import { Values, Proposal } from "../../types/types";

const rolesForAI = [
  "Chief Financial Officer",
  "Director of Marketing",
  "Personnel Manager",
  "Quality Manager",
];

const RenderAIProposals: React.FC<{ values: Values[]; setValues: React.Dispatch<React.SetStateAction<Values[]>> }> = ({ values, setValues }) => {
  const [valueProposal, setValueProposal] = useState<Proposal[]>([]); // State for initialValueproposals
  const [valueProposalUpdate, setValueProposalUpdate] = useState<Proposal[]>([]); // State for AI proposals
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialProposals = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/valueproposals");
        if (response.data && Array.isArray(response.data)) {
          setValueProposal(response.data); // Assuming the API returns an array of proposals
        } else {
          console.error("Invalid response format from API");
        }
      } catch (error) {
        console.error("Error fetching initial proposals:", error);
        alert("Failed to fetch initial proposals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProposals();
  }, []);
  async function* fetchValueProposals(): AsyncGenerator<Proposal> {
    for (let i = 0; i < rolesForAI.length; i++) {
      const response = await axios.post("http://localhost:5000/api/ai/generate-proposals", {
        prompt: `Have a strict role of "${rolesForAI[i]}". Generate a list of three company values with descriptions. Keep strong focus in your role. Answer in Finnish. Answer as a JSON with header arvot: and two parameters nimi: and kuvaus:`,
      });
      console.log("AI response:", response.data); // Log the AI response
      if (response.data && Array.isArray(response.data.proposals)) {
        for (const proposal of response.data.proposals) {
          yield {
            ...proposal,
            role: rolesForAI[i],
          };
        }
      } else {
        throw new Error(`Invalid response from AI for role: ${rolesForAI[i]}`);
      }
    }
  }

const handleFetchProposals = async () => {
  try {
    setLoading(true);

    // Iterate over the async generator and update state for each proposal
    for await (const proposal of fetchValueProposals()) {
      console.log("Fetched proposal:", proposal); // Log the fetched proposal
      setValueProposalUpdate((prevProposals) => [...prevProposals, proposal]);
    }
  } catch (error) {
    console.error("Virhe arvoehdotusten hakemisessa AI:lta:", error);
    alert("Arvoehdotusten hakeminen epäonnistui. Yritä uudelleen.");
  } finally {
    console.log("Final proposals:", valueProposalUpdate); // Log the final proposals
    setLoading(false);
  }
};

const handleRemoveProposal = (proposalName: string, value: Values) => {
  setValueProposal((prevProposals) =>
    prevProposals.map((proposal) =>
      proposal.role === proposalName
        ? {
            ...proposal,
            values: proposal.values.filter(
              (v) => v.nimi !== value.nimi || v.kuvaus !== value.kuvaus
            ),
          }
        : proposal
    )
  );
};

const handleAcceptProposal = (proposalRole: string, value: Values) => {
  const selectedProposal = valueProposal.find(
    (proposal) => proposal.role === proposalRole
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
              nimi: value.nimi,
              kuvaus: value.kuvaus,
            }
          : arvo
      )
    );

    alert(`Arvo ${index + 1} korvattiin onnistuneesti.`);
  }
};

const handleUpdateValues = async () => {
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

return (
  <div>
    {loading && (
  <div className="text-center my-4">
    <p>Ladataan arvoehdotuksia...</p>
  </div>
)}
    {valueProposal.map((proposal, index) => (
      <div key={index} className="mb-6">
        <h2 className="text-xl font-bold mb-4">{proposal.role} ehdottaa uusia arvoja</h2>
        {proposal.values && proposal.values.map((value, valueIndex) => (
          <div key={valueIndex} className="mb-4 flex items-center">
            {/* Accept and Delete Buttons */}
            <button
              onClick={() => handleAcceptProposal(proposal.role, value)}
              className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              ✓
            </button>
            <button
              onClick={() => handleRemoveProposal(proposal.role, value)}
              className="mr-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️
            </button>

            {/* Value Details */}
            <div>
              <p className="text-lg font-bold">{value.nimi}</p>
              <p className="text-sm">{value.kuvaus}</p>
            </div>
          </div>
        ))}
      </div>
    ))}

    {/* Back Button and Update Button Container */}
    <div className="flex justify-between mt-8">
      <button
        onClick={handleFetchProposals}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Lisää arvoehdotuksia
      </button>
      <button
        onClick={handleUpdateValues}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Päivitä arvot
      </button>
    </div>
  </div>
);
};
export default RenderAIProposals;