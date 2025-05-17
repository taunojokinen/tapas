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

  export const fetchTeamsForUser = async (username: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teams`);
      const teams: Team[] = response.data;
  
      // Filter teams where the user is either the owner or a member
      const filteredTeams = teams.filter(
        (team) => team.owner === username || team.members.includes(username)
      );
  
      return filteredTeams; // Return the filtered list of teams
    } catch (error) {
      console.error("Error fetching teams for user:", error);
      throw error; // Re-throw the error for handling in the calling code
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

  export const handleTeamAndObjectiveSelect = async (
    teamId: string,
    objectiveId: string,
    user: string,
    onUpdate: (teamObjective: any) => void
  ) => {
    try {
      const response = await axios.post("http://localhost:5000/api/teamobjectives/check", {
        teamId,
        objectiveId,
        user,
      });
  
      const teamObjective = response.data.teamObjective;
      console.log("returned Team Objective:", teamObjective); // Debug log
  
      // Ensure the response includes the correct _id fields
      onUpdate({
        ...teamObjective,
        objectives: teamObjective.objectives.map((obj: any) => ({
          _id: obj._id,
          nimi: obj.nimi,
          mittari: obj.mittari,
          seuranta: obj.seuranta,
        })),
      });
    } catch (error) {
      console.error("Error checking or creating team objective:", error);
    }
  };

