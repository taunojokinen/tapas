import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Values, Proposal } from "../../types/types";
//import { fetchValueProposals } from "./AIProposals";
import RenderCurrentValues from "./RenderCurrentValues";
import RenderAIProposals from "./AIProposals";


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

      //alert(`Arvo ${index + 1} korvattiin onnistuneesti.`);
    }
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT</h1>
      <RenderCurrentValues values={values} setValues={setValues} />
      <RenderAIProposals values={values} setValues={setValues} />

      {/* Render valueProposal grouped by role */}

{/* <div className="mb-6">
  {rolesForAI.map((role) => {
    const proposalsForRole = valueProposal.filter(
      (proposal) => proposal.role === role */}
    </div>
    );
  }

export default ChangeValues;
