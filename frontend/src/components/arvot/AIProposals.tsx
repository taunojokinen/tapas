import React, { useState , useEffect} from "react";
import axios from "axios";
import { Proposal } from "../../types/types";


const rolesForAI = [
  "Chief Financial Officer",
  "Director of Marketing",
  "Personnel Manager",
  "Quality Manager",
];

export async function* fetchValueProposals(): AsyncGenerator<Proposal> {
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

