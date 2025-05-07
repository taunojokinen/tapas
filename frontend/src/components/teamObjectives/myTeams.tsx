import React, { useEffect, useState } from "react";
import { fetchUserTeams } from "./TeamFunctions"; // Import the fetch function
import useAuth from "../../hooks/useAuth"; // Import the custom hook
import { Team } from "../../types/types"; // Adjust the path as needed


const MyTeams: React.FC = () => {
  const { username } = useAuth(); // Get the username from the custom hook
  const [teams, setTeams] = useState<Team[]>([]); // State to store the teams
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchTeams = async () => {
      if (username) {
        const userTeams = await fetchUserTeams(username); // Fetch teams for the user
        if (userTeams) {
          setTeams(userTeams); // Update the state with the fetched teams
        }
        setLoading(false); // Stop loading
      }
    };

    fetchTeams();
  }, [username]);

  if (loading) {
    return <p>Loading teams...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold text-gray-800">Tiimit</h2>
      {teams.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {teams.map((team) => (
            <li key={team._id} className="p-2 border border-gray-300 rounded">
              <h3 className="text-lg font-semibold">{team.name}</h3>
              <p className="text-sm text-gray-600">Tyyppi: {team.type}</p>
              <p className="text-sm text-gray-600">Tehtävä: {team.mission}</p>
              <p className="text-sm text-gray-600">
                Jäsenet: {team.members.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mt-4">Ei tiimejä.</p>
      )}
    </div>
  );
};

export default MyTeams;