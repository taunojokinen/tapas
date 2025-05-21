import { TeamObjective, CompanyObjectives, Strategia } from "../../types/types";

export async function FetchKeyStrategies() {
    try {
        console.log('Fetching key strategies...');
        const response = await fetch('http://localhost:5000/api/strategiat');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Response received:', response);
        const data = await response.json();
        //alert('Key strategies fetched successfully!');
        return data;
    } catch (error) {
        console.error('Error fetching key strategies:', error);
        throw error;
    }
}

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
        type: "team", // or another appropriate value for your use case
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
export async function putTeamObjectiveData(teamObjectiveId: string, payload: any): Promise<void> {
    try {
        const response = await fetch(`http://localhost:5000/api/teamobjectives/${teamObjectiveId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to update team objective. Status: ${response.status}`);
        }

        console.log("Team objective updated successfully.");
    } catch (error) {
        console.error("Error updating team objective:", error);
        throw error;
    }
}