import axios from "axios";
import { Team } from "../../types/types";

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

  export const saveNewTeam = async (newTeam: Omit<Team, "_id" | "owner">, owner: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/teams", {
        ...newTeam,
        owner, // Add the owner to the request body
      });
      return response.data; // Return the created team
    } catch (error) {
      console.error("Error saving new team:", error);
      throw error; // Re-throw the error for handling in the calling code
    }
  };
  export const updateTeam = async (teamId: string, updatedTeam: Omit<Team, "_id" | "owner">, owner: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/teams/${teamId}`, {
        ...updatedTeam,
        owner, // Include the owner in the request body
      });
      console.log("Team updated:", response.data);
      return response.data; // Return the updated team
    } catch (error) {
      console.error("Error updating team:", error);
      throw error; // Re-throw the error for handling in the calling code
    }
  };
  export const deleteTeam = async (teamId: string) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/teams/${teamId}`);
      console.log("Team deleted:", teamId);
      return response.data; // Return the response from the server
    } catch (error) {
      console.error("Error deleting team:", error);
      throw error; // Re-throw the error for handling in the calling code
    }
  };

