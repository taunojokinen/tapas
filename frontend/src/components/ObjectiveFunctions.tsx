import { TeamObjective, CompanyObjectives, Strategia } from "../types/types";

export async function fetchCompanyObjectives(query: string): Promise<TeamObjective[] | null> {
  try {
    const response = await fetch("http://localhost:5000/api/companyobjectives");
    if (!response.ok) throw new Error("Failed to fetch company objectives");
    const objectives: CompanyObjectives[] = await response.json();
    const objectivesList: CompanyObjectives[] = Array.isArray(objectives) ? objectives : [];
    let filtered: CompanyObjectives[] = objectivesList;
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = objectivesList.filter((obj: CompanyObjectives) =>
        obj.avainstrategiat.some((strategia) => strategia.tavoite.toLowerCase().includes(lowerQuery)) ||
        obj.avainstrategiat.some((strategia) => strategia.toimenpide.toLowerCase().includes(lowerQuery)) ||
        obj.avainstrategiat.some((strategia) => strategia.seuranta.toLowerCase().includes(lowerQuery))
      );
    }
    // Map CompanyObjectives to TeamObjective[]
    const teamObjectives: TeamObjective[] = filtered.flatMap((obj: CompanyObjectives) =>
      obj.avainstrategiat.map((strategia: Strategia) => ({
        type: "company", // or another appropriate string value for your use case
        nimi: strategia.tavoite,
        mittari: strategia.toimenpide,
        seuranta: strategia.seuranta,
        tasks: [],
        hindrances: [],
        promoters: []
      }))
    );
    return teamObjectives;
  } catch (error) {
    console.error("Error fetching or searching company objectives:", error);
    return null;
  }
}


export async function updateObjectives(username: string, updatedObjectives: any[]) {
  await fetch(`http://localhost:5000/api/myobjectives/${username}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objectives: updatedObjectives }),
  });
}

// Example usage:
// updateObjectives(username, updatedObjectives);