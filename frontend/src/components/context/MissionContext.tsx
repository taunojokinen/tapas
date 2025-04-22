import React, { createContext, useContext, useState } from "react";

interface MissionContextProps {
  mission: string;
  setMission: React.Dispatch<React.SetStateAction<string>>;
}

const MissionContext = createContext<MissionContextProps | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mission, setMission] = useState(
    "Ohjelmistosuunnittelijan perustehtävä on suunnitella, kehittää ja ylläpitää korkealaatuisia ohjelmistoratkaisuja, jotka vastaavat asiakkaiden ja organisaation tarpeita."
  );

  return (
    <MissionContext.Provider value={{ mission, setMission }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = (): MissionContextProps => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  return context;
};