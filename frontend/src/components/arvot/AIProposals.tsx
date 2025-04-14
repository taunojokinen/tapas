import React, { useState , useEffect} from "react";
import axios from "axios";
import { Values, Proposal } from "../../types/types";
import RenderCurrentValues from "./RenderCurrentValues";


const rolesForAI = [
  "Chief Financial Officer",
  "Director of Marketing",
  "Personnel Manager",
  "Quality Manager",
];

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
const RenderAIProposals: React.FC<{ values: Values[]; setValues: React.Dispatch<React.SetStateAction<Values[]>> }> = ({ values, setValues }) => {
  const [valueProposal, setValueProposal] = useState(initialValueProposal);
  const [loading, setLoading] = useState(false);
async function* fetchValueProposals(): AsyncGenerator<Proposal> {
  for (let i = 0; i < rolesForAI.length; i++) {
    const response = await axios.post("http://localhost:5000/api/ai/generate-proposals", {
      prompt: `Have a strict role of "${rolesForAI[i]}". Generate a list of three company values with descriptions. Keep strong focus in your role. Answer in Finnish. Answer as a JSON with header arvot: and two parameters nimi: and kuvaus:`,
    });

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
      setValueProposal((prevProposals) => [...prevProposals, proposal]);
    }
  } catch (error) {
    console.error("Virhe arvoehdotusten hakemisessa AI:lta:", error);
    alert("Arvoehdotusten hakeminen epäonnistui. Yritä uudelleen.");
  } finally {
    setLoading(false);
  }
};

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

    //alert(`Arvo ${index + 1} korvattiin onnistuneesti.`);
  }
};
return rolesForAI.map((role) => {
  const proposalsForRole = valueProposal.filter((proposal) => proposal.role === role);
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

{/* Back Button and Update Button Container */}
<div className="flex justify-between mt-8">
  <button
    // onClick={handleFetchProposals}
    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
  >
    Lisää arvoehdotuksia
  </button>
  <button
    // onClick={handleUpdateValues}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Päivitä arvot
  </button>
</div>

export default RenderAIProposals;