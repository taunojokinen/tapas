import React, { useState , useEffect} from "react";
import axios from "axios";
import { Values, Proposal } from "../../types/types";

const rolesForAI = [
  "Chief Financial Officer",
  "Director of Marketing",
  "Personnel Manager",
  "Quality Manager",
];

const aiQuestion = `Generate a list of three company values with descriptions. Keep strong focus in your role. Answer in Finnish.`;
const aiFormat = `Answer strictly as a valid JSON object with the header "arvot" and two keys "nimi" and "kuvaus". 
Do not include any additional text or formatting.`;
const aiPrompt =  `${aiQuestion} ${aiFormat}`;

const RenderAIProposals: React.FC<{ values: Values[]; setValues: React.Dispatch<React.SetStateAction<Values[]>> }> = ({ values, setValues }) => {
  const [valueProposal, setValueProposal] = useState<Proposal[]>([]); // State for initialValueproposals
  const [valueProposalUpdate, setValueProposalUpdate] = useState<Proposal[]>([]); // State for AI proposals
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Ladataan ehdotuksia...");

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
  async function* fetchValueProposals(role: string, prompt: string): AsyncGenerator<Proposal> {
    const response = await axios.post("http://localhost:5000/api/ai/generate-proposals", {
      prompt: `Have a strict role of "${role}". ${prompt}`,
    });
  
    console.log("AI response for role:", role, response.data);
  
    if (response.data && Array.isArray(response.data.proposals)) {
      for (const proposal of response.data.proposals) {
        // Wrap the proposal in the expected structure
        yield {
          role,
          values: [
            {
              nimi: proposal.nimi,
              kuvaus: proposal.kuvaus,
            },
          ],
        };
      }
    } else {
      throw new Error(`Invalid response from AI for role: ${role}`);
    }
  }

  const handleFetchProposals = async () => {
    try {
      setLoading(true);
      console.log(aiPrompt);
  
      const newProposals: Record<string, Proposal> = {};
  
      // Clear the previous proposals
      setValueProposalUpdate([]); // Reset the state before fetching new proposals
      console.log("valueProposalUpdate reset", valueProposalUpdate);
  
      for (const role of rolesForAI) {
        setLoadingMessage(`${role} miettii uusia ehdotuksia arvoiksi ...`);
        for await (const proposal of fetchValueProposals(role, aiPrompt)) {
          if (!newProposals[role]) {
            newProposals[role] = { role, values: [] };
          }
  
          // Validate proposal.values before accessing it
          if (proposal.values && Array.isArray(proposal.values) && proposal.values.length > 0) {
            newProposals[role].values.push(proposal.values[0]); // Add the first value
          } else {
            console.error(`Invalid proposal.values for role: ${role}`, proposal);
          }
        }
      }
  
      // Update the state with grouped proposals
      setValueProposalUpdate(Object.values(newProposals));
    } catch (error) {
      console.error("Error fetching proposals from AI:", error);
      alert("Failed to fetch proposals. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMessage("Ladataan ehdotuksia...");
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

const handleUpdateValuePrposals = React.useCallback(async () => {
  try {
    // Validate valueProposalUpdate before sending
    const isValid = valueProposalUpdate.every(
      (proposal) =>
        proposal.role &&
        Array.isArray(proposal.values) &&
        proposal.values.every((value) => value.nimi && value.kuvaus)
    );

    if (!isValid) {
      alert("Data validation failed. Ensure all fields are filled.");
      console.error("Invalid data:", valueProposalUpdate);
      return;
    }

    // Log the data being sent
    console.log("Päivitetyt arvot:", valueProposalUpdate);

    // First, delete the existing proposals
    await axios.delete("http://localhost:5000/api/valueproposals");
    console.log("Existing proposals deleted successfully.");

    // Then, post the updated proposals
    await axios.post("http://localhost:5000/api/valueproposals", valueProposalUpdate); // Send as an array
    console.log("Updated proposals saved successfully.");

    alert("Arvot päivitettiin ja tallennettiin onnistuneesti!");
  } catch (err) {
    console.error("Virhe arvotietojen päivittämisessä:", err);
    alert("Arvojen päivittäminen epäonnistui. Yritä uudelleen.");
  }
}, [valueProposalUpdate]);

useEffect(() => {
  console.log("Updated valueProposalUpdate:", valueProposalUpdate);

  // Update valueProposal with the content of valueProposalUpdate
  if (valueProposalUpdate.length > 0) {
    setValueProposal(valueProposalUpdate);
    handleUpdateValuePrposals()
  }
}, [valueProposalUpdate, handleUpdateValuePrposals]);

return (
  <div>
    <h2 className="text-xl font-bold mb-4">Ehdotuksia arvoista, joilla voit korvata nykyisiä arvoja</h2>
    {loading && (
      <div className="text-center my-4">
        <h2>
        <strong>{loadingMessage}</strong>
        </h2>
      </div>
    )}

    {/* Render initial proposals */}
    {valueProposal.map((proposal, index) => (
      <div key={index} className="mb-6">
        <h2 className="text-xl font-bold mb-4">{proposal.role} ehdottaa uusia arvoja</h2>
        {proposal.values &&
          proposal.values.map((value, valueIndex) => (
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
            <button
        onClick={handleFetchProposals}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Lisää arvoehdotuksia
      </button>
      {loading && (
      <div className="text-center my-4">
      <h2>
        <strong>{loadingMessage}</strong>
      </h2>
      </div>
    )}
  </div>
);
};
export default RenderAIProposals;