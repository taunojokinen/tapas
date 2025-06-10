import React, { useState, useEffect } from "react";

import McVirtanen from "../../pictures/McVirtanen.jpg";
import { getCoachTexts } from "./myCoachText";
import { ViewMode } from "../../types/enums";

interface MyCoachProps {
  user: string;
  viewMode?: ViewMode;
}

const MyCoach: React.FC<MyCoachProps> = ({ user, viewMode }) => {
  

  return (
    <div>
      <div className="flex flex-row items-start gap-6 pt-4 pr-4 pb-0 pl-4">
        <img
          src={McVirtanen}
          alt="McVirtanen"
          className="w-32 h-32 object-cover rounded shadow"
        />
        <p>{getCoachTexts(user)[viewMode ?? ViewMode.ShowAll]}</p>
      </div>
      <div className="flex items-center justify-between p-4 shadow mb-0 ml-4"></div>
    </div>
  );
};

export default MyCoach;
