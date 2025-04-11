import React, { useState } from "react";
import axios from "axios";
import { Proposal } from "../../types/types";

interface AIProposalsProps {
  onProposalsFetched: (proposals: Proposal[]) => void;
}

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

const AIProposals: React.FC<AIProposalsProps> = ({ onProposalsFetched }) => {
  const [loading, setLoading] = useState(false);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const allProposals: Proposal[] = [];

      for (let i = 0; i < rolesForAI.length; i++) {
        const response = await axios.post("http://localhost:5000/api/ai/generate-proposals", {
          prompt: `Have a strict role of "${rolesForAI[i]}". Generate a list of three company values with descriptions. Keep strong focus in your role. Answer in Finnish. Answer as a JSON with header arvot: and two parameters nimi: and kuvaus:`,
        });

        if (response.data && Array.isArray(response.data.proposals)) {
          allProposals.push(
            ...response.data.proposals.map((proposal: Proposal) => ({
              ...proposal,
              role: rolesForAI[i],
            }))
          );
        } else {
          throw new Error(`Invalid response from AI for role: ${rolesForAI[i]}`);
        }
      }

      onProposalsFetched(allProposals);
      alert("All proposals fetched successfully!");
    } catch (error) {
      console.error("Error fetching proposals from AI:", error);
      alert("Failed to fetch proposals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchProposals}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Proposals"}
      </button>
    </div>
  );
};

export default AIProposals;