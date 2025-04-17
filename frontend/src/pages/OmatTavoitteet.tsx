import React from "react";
import MyMission from "../components/omatTavoitteet/mymission"; // Adjust the path if necessary
import KeyObjectives from "../components/omatTavoitteet/keyObjectives"; // Adjust the path if necessary


const OmatTavoitteet = () => {


  return (
    <div>
            <h2 className="text-xl font-bold text-gray-800">Omat tavoitteet</h2>
      <div className="flex flex-col space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Perustehtävä</h2>
          <MyMission />
          <KeyObjectives />
        </div>
    </div>
    </div>
  )
}

export default OmatTavoitteet
