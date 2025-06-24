import React, { useEffect, useState } from "react";
import {
  saveNewTeam,
  updateTeam,
  deleteTeam,
  fetchTeamsForUser,
} from "./TeamFunctions"; // Import the fetch function
import useAuth from "../../hooks/useAuth"; // Import the custom hook
import { Team, TeamObjective } from "../../types/types"; // Adjust the path as needed

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export interface User {
  _id: string; // MongoDB ID for the user
  username: string; // Username of the user
}
export interface MyTeamsProps {
  selectedTeam: Team | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  onTeamSelect?: (team: Team | null) => void; // Optional callback for team selection
}

const MyTeams: React.FC<MyTeamsProps> = ({
  selectedTeam,
  setSelectedTeam,
  onTeamSelect,
}) => {
  const { username } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState<{
    name: string;
    type: string;
    mission: string;
    members: string[];
    teamObjectives: TeamObjective[];
  }>({
    name: "",
    type: "",
    mission: "",
    members: [],
    teamObjectives: [],
  });
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (username) {
        try {
          const userTeams = await fetchTeamsForUser(username);
          setTeams(userTeams);
        } catch (error) {
          console.error("Failed to fetch teams:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchUserList = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/userlist`);
        const users: User[] = await response.json();
        setUserList(users);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchTeams();
    fetchUserList();
  }, [username]);

  if (loading) {
    return <p>Loading teams...</p>;
  }

  const handleTeamSelect = (teamId: string) => {
    const team = teams.find((t) => t._id === teamId);
    if (team) {
      setSelectedTeam(team); // Set the selected team locally
      if (onTeamSelect) {
        onTeamSelect(team); // Pass the selected team to the parent component
      }
    } else {
      console.error(`Team with ID ${teamId} not found.`);
    }
  };

  const handleShowAllTeams = () => {
    setSelectedTeam(null); // Reset the selected team locally
    if (onTeamSelect) {
      onTeamSelect(null); // Notify parent with null, not a dummy object
    }
  };
  const handleCreateNewTeam = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewTeam({
      name: "",
      type: "",
      mission: "",
      members: [],
      teamObjectives: [],
    });
  };

  const handleSaveNewTeam = async () => {
    try {
      if (selectedTeam) {
        // Update the existing team
        const updatedTeam = await updateTeam(
          selectedTeam._id,
          newTeam,
          username
        );
        setTeams((prev) =>
          prev.map((team) =>
            team._id === updatedTeam._id ? updatedTeam : team
          )
        );
        console.log("Team updated:", updatedTeam);
      } else {
        // Create a new team
        const createdTeam = await saveNewTeam(newTeam, username);
        setTeams((prev) => [...prev, createdTeam]);
        console.log("New team created:", createdTeam);
      }

      // Close the modal and reset the form
      handleModalClose();
      setSelectedTeam(null);
    } catch (error) {
      console.error("Failed to save the team:", error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    const confirmDelete = window.confirm(
      "Haluatko varmasti poistaa tämän tiimin?"
    );
    if (!confirmDelete) {
      setSelectedTeam(null);
      console.log(
        "Deletion canceled. Returning to 'Näytä kaikki tiimit' state."
      );
      return;
    }

    try {
      await deleteTeam(teamId);
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
      setSelectedTeam(null);
      console.log("Team deleted:", teamId);
    } catch (error) {
      console.error("Failed to delete the team:", error);
    }
  };

  const handleEditTeam = (team: Team) => {
    // Populate the form with the selected team's details
    setNewTeam({
      name: team.name,
      type: team.type,
      mission: team.mission,
      members: team.members,
      teamObjectives: team.teamObjectives || [], // Ensure teamObjectives is included
    });

    // Set the selected team for editing
    setSelectedTeam(team);

    // Open the modal for editing
    setShowModal(true);
  };

  const handleMemberToggle = (userId: string) => {
    setNewTeam((prev) => {
      const isMember = prev.members.includes(userId);
      const updatedMembers = isMember
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId];
      return { ...prev, members: updatedMembers };
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between">
        {!selectedTeam && (
          <h2 className="text-xl font-bold text-gray-800">Tiimit</h2>
        )}
        <div className="flex gap-2">
          {!selectedTeam && (
            <button
              onClick={handleCreateNewTeam}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Luo uusi tiimi
            </button>
          )}
        </div>
      </div>
      {selectedTeam ? (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {selectedTeam.name} - {selectedTeam.mission} - Omistaja:{" "}
              {selectedTeam.owner}
            </h3>
            <button
              onClick={handleShowAllTeams}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Näytä kaikki tiimit
            </button>
          </div>
        </div>
      ) : (
        <>
          {teams.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {teams.map((team) => (
                <li
                  key={team._id}
                  className="p-2 border border-gray-300 rounded flex justify-between items-center hover:bg-gray-100"
                  onClick={() => handleTeamSelect(team._id)}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <p className="text-sm text-gray-600">Tyyppi: {team.type}</p>
                    <p className="text-sm text-gray-600">
                      Tehtävä: {team.mission}
                    </p>
                    <p className="text-sm text-gray-600">
                      Jäsenet: {team.members.join(", ")}
                    </p>
                  </div>
                  {team.owner === username && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTeam(team);
                        }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Muokkaa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTeam(team._id);
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-4">Ei tiimejä.</p>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Luo uusi tiimi</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nimi
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tyyppi
              </label>
              <select
                value={newTeam.type}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, type: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Valitse tyyppi</option>
                <option value="projekti">Projekti</option>
                <option value="Toiminnan kehittäminen">
                  Toiminnan kehittäminen
                </option>
                <option value="johtoryhmä">Johtoryhmä</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tehtävä
              </label>
              <textarea
                value={newTeam.mission}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, mission: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Jäsenet
              </label>
              <div className="mt-2 space-y-2">
                {userList.map((user) => (
                  <div key={user._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTeam.members.includes(user.username)}
                      onChange={() => handleMemberToggle(user.username)}
                      className="mr-2"
                    />
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Peruuta
              </button>
              <button
                onClick={handleSaveNewTeam}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Tallenna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeams;
