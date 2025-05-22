import React, { useState } from "react";
import MyTeams from "../components/teamObjectives/myTeams";
import TeamObjectives from "../components/teamObjectives/TeamObjectives";
import TeamTasks from "../components/teamObjectives/TeamTasks";
import TeamCurrentState from "../components/teamObjectives/TeamCurrentState";
import { Team } from "../types/types";
import { putTeamObjectiveData, putTeamObjectivesArray } from "../components/teamObjectives/TeamObjectiveFunctions";

const MyTeamObjectives: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedObjectiveIndex, setSelectedObjectiveIndex] = useState<number | null>(null);


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tiimin Tavoitteet - täällä voit tarkastella ja muokata tiimin tavoitteita.
        </h1>
      </div>
      <MyTeams selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />

      <TeamObjectives
        selectedTeam={selectedTeam}
        setSelectedTeam={async (updatedTeam) => {
          setSelectedTeam(updatedTeam);
          if (
            updatedTeam &&
            typeof updatedTeam === "object" &&
            "_id" in updatedTeam &&
            "teamObjectives" in updatedTeam
          ) {
            await putTeamObjectivesArray(updatedTeam._id, updatedTeam.teamObjectives);
          }
        }}
        selectedObjectiveIndex={selectedObjectiveIndex}
        onSelectObjective={setSelectedObjectiveIndex}
      />

      {selectedObjectiveIndex !== null && selectedObjectiveIndex !== undefined && selectedTeam && (
        <>
          <TeamTasks
            tasks={selectedTeam.teamObjectives[selectedObjectiveIndex]?.tasks ?? []}
            onTasksChange={async (updatedTasks) => {
              if (!selectedTeam || selectedObjectiveIndex === null) return;
              const updatedObjectives = selectedTeam.teamObjectives.map((obj, idx) =>
                idx === selectedObjectiveIndex ? { ...obj, tasks: updatedTasks } : obj
              );
              setSelectedTeam({ ...selectedTeam, teamObjectives: updatedObjectives });
              const updatedObjective = updatedObjectives[selectedObjectiveIndex];
              if (updatedObjective._id) {
                await putTeamObjectiveData(updatedObjective._id, updatedObjective);
              }
            }}
          />
          <TeamCurrentState
            hindrances={selectedTeam.teamObjectives[selectedObjectiveIndex]?.hindrances ?? []}
            promoters={selectedTeam.teamObjectives[selectedObjectiveIndex]?.promoters ?? []}
            onChangeHindrances={async (updatedHindrances) => {
              if (!selectedTeam || selectedObjectiveIndex === null) return;
              const updatedObjectives = selectedTeam.teamObjectives.map((obj, idx) =>
                idx === selectedObjectiveIndex ? { ...obj, hindrances: updatedHindrances } : obj
              );
              setSelectedTeam({ ...selectedTeam, teamObjectives: updatedObjectives });
              const updatedObjective = updatedObjectives[selectedObjectiveIndex];
              if (updatedObjective._id) {
                await putTeamObjectiveData(updatedObjective._id, updatedObjective);
              }
            }}
            onChangePromoters={async (updatedPromoters) => {
              if (!selectedTeam || selectedObjectiveIndex === null) return;
              const updatedObjectives = selectedTeam.teamObjectives.map((obj, idx) =>
                idx === selectedObjectiveIndex ? { ...obj, promoters: updatedPromoters } : obj
              );
              setSelectedTeam({ ...selectedTeam, teamObjectives: updatedObjectives });
              const updatedObjective = updatedObjectives[selectedObjectiveIndex];
              if (updatedObjective._id) {
                await putTeamObjectiveData(updatedObjective._id, updatedObjective);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default MyTeamObjectives;