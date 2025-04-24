import React from "react";
import MyMission from "../components/omatTavoitteet/mymission"; // Adjust the path if necessary
import KeyObjectives from "../components/omatTavoitteet/keyObjectives"; // Adjust the path if necessary
import MyTasks from "../components/omatTavoitteet/myTasks"; // Adjust the path if necessary
import MyCurrentState from "../components/omatTavoitteet/myCurrenState"; // Adjust the path if necessary
import useAuth from "../hooks/useAuth"; // Import the custom hook


const OmatTavoitteet = () => {
  const { username } = useAuth();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">Käyttäjä {username} Omat tavoitteet</h2>
      <div className="flex flex-col space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <MyMission />
          <KeyObjectives />
          <MyTasks />
          <MyCurrentState />
        </div>
      </div>
    </div>
  )
}

export default OmatTavoitteet
