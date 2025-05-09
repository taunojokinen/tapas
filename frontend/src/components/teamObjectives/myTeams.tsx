import React, { useEffect, useState } from "react";
import { fetchUserTeams, saveNewTeam, updateTeam, deleteTeam, fetchTeamsForUser  } from "./TeamFunctions"; // Import the fetch function
import useAuth from "../../hooks/useAuth"; // Import the custom hook
import { Team } from "../../types/types"; // Adjust the path as needed

export interface User {
  _id: string; // MongoDB ID for the user
  username: string; // Username of the user
}

const MyTeams: React.FC = () => {
  const { username } = useAuth(); // Get the username from the custom hook
  const [teams, setTeams] = useState<Team[]>([]); // State to store the teams
  const [loading, setLoading] = useState(true); // State to handle loading
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null); // State to store the selected team
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [newTeam, setNewTeam] = useState<{ name: string; type: string; mission: string; members: string[] }>({
    name: "",
    type: "",
    mission: "",
    members: [],
  }); // State for new team data
  const [userList, setUserList] = useState<User[]>([]); // State to store the user list

  useEffect(() => {
    const fetchTeams = async () => {
      if (username) {
        try {
          const userTeams = await fetchTeamsForUser(username); // Use the new function
          setTeams(userTeams); // Update the state with the filtered teams
        } catch (error) {
          console.error("Failed to fetch teams:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };
  
    const fetchUserList = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/userlist");
        const users: User[] = await response.json();
        setUserList(users); // Update the state with the fetched user list
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
      setSelectedTeam(team); // Set the selected team
    } else {
      console.error(`Team with ID ${teamId} not found.`);
    }
  };

  const handleShowAllTeams = () => {
    setSelectedTeam(null);
  };

  const handleCreateNewTeam = () => {
    setShowModal(true); // Show the modal
  };

  const handleModalClose = () => {
    setShowModal(false); // Hide the modal
    setNewTeam({ name: "", type: "", mission: "", members: [] }); // Reset the form
  };

  const handleSaveNewTeam = async () => {
    try {
      if (selectedTeam) {
        // Editing an existing team
        const updatedTeam = await updateTeam(selectedTeam._id, newTeam, username);
        setTeams((prev) =>
          prev.map((team) => (team._id === selectedTeam._id ? updatedTeam : team))
        ); // Update the team in the list
        console.log("Team updated:", updatedTeam);
      } else {
        // Creating a new team
        const createdTeam = await saveNewTeam(newTeam, username);
        setTeams((prev) => [...prev, createdTeam]); // Add the new team to the list
        console.log("New team created:", createdTeam);
      }
  
      handleModalClose(); // Close the modal after saving
      setSelectedTeam(null); // Clear the selected team
    } catch (error) {
      console.error("Failed to save the team:", error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    const confirmDelete = window.confirm("Haluatko varmasti poistaa tämän tiimin?");
    if (!confirmDelete) {
      setSelectedTeam(null); // Return to "Näytä kaikki tiimit" state
      console.log("Deletion canceled. Returning to 'Näytä kaikki tiimit' state.");
      return; // Exit if the user cancels the deletion
    }
  
    try {
      await deleteTeam(teamId); // Use the centralized delete function
      setTeams((prev) => prev.filter((team) => team._id !== teamId)); // Remove the deleted team from the list
      setSelectedTeam(null); // Return to "Näytä kaikki tiimit" state
      console.log("Team deleted:", teamId);
    } catch (error) {
      console.error("Failed to delete the team:", error);
    }
  };
  
  const handleEditTeam = (team: Team) => {
    setNewTeam({
      name: team.name,
      type: team.type,
      mission: team.mission,
      members: team.members,
    });
    setSelectedTeam(team); // Set the selected team for editing
    setShowModal(true); // Open the modal for editing
  };

  const handleMemberToggle = (userId: string) => {
    setNewTeam((prev) => {
      const isMember = prev.members.includes(userId);
      const updatedMembers = isMember
        ? prev.members.filter((id) => id !== userId) // Remove if already selected
        : [...prev.members, userId]; // Add if not selected
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
            <h3 className="text-lg font-semibold">{selectedTeam.name} - {selectedTeam.mission} - Omistaja: {selectedTeam.owner}</h3>
            {selectedTeam && (
            <button
              onClick={handleShowAllTeams}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Näytä kaikki tiimit
            </button>
          )}
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
      onClick={() => handleTeamSelect(team._id)} // Call handleTeamSelect with team._id
    >
      <div>
        <h3 className="text-lg font-semibold">{team.name}</h3>
        <p className="text-sm text-gray-600">Tyyppi: {team.type}</p>
        <p className="text-sm text-gray-600">Tehtävä: {team.mission}</p>
        <p className="text-sm text-gray-600">
          Jäsenet: {team.members.join(", ")}
        </p>
      </div>
      {team.owner === username && ( // Only show buttons if the user is the owner
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering handleTeamSelect
              handleEditTeam(team);
            }}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Muokkaa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering handleTeamSelect
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

      {/* Modal for creating a new team */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Luo uusi tiimi</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nimi</label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tyyppi</label>
              <select
                value={newTeam.type}
                onChange={(e) => setNewTeam({ ...newTeam, type: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Valitse tyyppi</option>
                <option value="projekti">Projekti</option>
                <option value="Toiminnan kehittäminen">Toiminnan kehittäminen</option>
                <option value="johtoryhmä">Johtoryhmä</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tehtävä</label>
              <textarea
                value={newTeam.mission}
                onChange={(e) => setNewTeam({ ...newTeam, mission: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Jäsenet</label>
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