import React, { useState, useEffect } from "react";
import { fetchUserTitlesByUsername } from "./myObjectiveFunctions";
import McVirtanen from "../../pictures/McVirtanen.jpg";
import { getCoachTexts } from "./myCoachText";
import { ViewMode } from "../../types/enums";
import MyCoachAiAnswer from "./myCoachFunctions";

interface MyCoachProps {
  user: string;
  viewMode?: ViewMode;
  setMission: React.Dispatch<React.SetStateAction<string>>;
}

const MyCoach: React.FC<MyCoachProps> = ({ user, viewMode, setMission }) => {
  const [title, setTitle] = useState<string>(""); // State for the title

  const fetchAndSetTitle = async () => {
    if (user) {
      const titles = await fetchUserTitlesByUsername(user);
      if (titles && titles.length > 0) {
        setTitle(titles[0]); // Set the first title found
      }
    }
  };

  useEffect(() => {
    fetchAndSetTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between p-4 shadow mb-0 ml-4">
        <h2 className="text-xl font-bold text-gray-800">
          {title} {user} - omat tavoitteet.
        </h2>
      </div>
      <div className="flex flex-row items-start gap-6 pt-4 pr-4 pb-0 pl-4">
        <img
          src={McVirtanen}
          alt="McVirtanen"
          className="w-32 h-32 object-cover rounded shadow"
        />
        <p>{getCoachTexts(user)[viewMode ?? ViewMode.ShowAll]}</p>
      </div>
      <div className="flex items-center justify-between p-4 shadow mb-0 ml-4">
        <div className="flex-1">
          {/* Show coachTexts for other modes, or AI answer for MyMission */}
          {viewMode === ViewMode.MyMission ? (
            <MyCoachAiAnswer viewMode={viewMode} title={title} setMission={setMission} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyCoach;
