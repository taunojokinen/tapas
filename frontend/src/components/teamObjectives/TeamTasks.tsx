import { MyTask, Team } from "../../types/types";

interface Props {
  selectedTeam: Team | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
}

const TeamTasks: React.FC<Props> = ({ selectedTeam, setSelectedTeam  }) => {
  const tasks =
    selectedTeam?.teamObjectives?.flatMap((objective) => objective.tasks ?? []) ?? [];

    const handleTaskChange = (index: number, value: string, field: keyof MyTask) => {
  if (!selectedTeam) return;
  let taskCounter = 0;
  const updatedObjectives = selectedTeam.teamObjectives.map((objective) => {
    const updatedTasks = objective.tasks.map((task) => {
      const currentIndex = taskCounter;
      taskCounter++;
      if (currentIndex === index) {
        return { ...task, [field]: value };
      }
      return task;
    });
    return { ...objective, tasks: updatedTasks };
  });
  setSelectedTeam({ ...selectedTeam, teamObjectives: updatedObjectives });
};

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <p>TeamTasks</p>
      {/* <h2 className="text-lg font-bold text-gray-800">Tiimin Tehtävät</h2>
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <div key={index} className="mb-4 flex items-center gap-4">
            <input
              type="text"
              value={task.nimi}
              onChange={(e) => handleTaskChange(index, e.target.value, "nimi")}
              className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
            />
            <input
              type="text"
              value={task.mittari}
              onChange={(e) => handleTaskChange(index, e.target.value, "mittari")}
              className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
            />
            <select
              value={task.seuranta}
              onChange={(e) => handleTaskChange(index, e.target.value, "seuranta")}
              className="w-full p-1 border"
            >
              <option value="">Valitse</option>
              <option value="Aloitettu">🟡 Aloitettu</option>
              <option value="Aloittamatta">🔴 Aloittamatta</option>
              <option value="Kesken">🟠 Kesken</option>
              <option value="Valmis">🟢 Valmis</option>
            </select>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ei tehtäviä.</p>
      )} */}
    </div>
  );
};

export default TeamTasks;