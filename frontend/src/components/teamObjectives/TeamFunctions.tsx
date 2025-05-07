import axios from "axios";
import { MyObjectivesJson } from "../../types/types"; // Adjust the path if necessary

// Function to fetch teams for a specific user
export const fetchUserTeams = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teams/owner/${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch teams: ${response.statusText}`);
      }
      const teams = await response.json();
      return teams; // Returns the list of teams
    } catch (error) {
      console.error("Error fetching user teams:", error);
      return null; // Return null in case of an error
    }
  };