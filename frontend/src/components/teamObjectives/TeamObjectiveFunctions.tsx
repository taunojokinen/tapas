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

export async function patchTeamObjectiveData(teamName: string, payload: any): Promise<void> {
    try {
        const response = await fetch(`http://localhost:5000/api/teams/${teamName}/objectives`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to update team objectives. Status: ${response.status}`);
        }

        console.log("Team objectives updated successfully.");
    } catch (error) {
        console.error("Error updating team objectives:", error);
        throw error;
    }
}