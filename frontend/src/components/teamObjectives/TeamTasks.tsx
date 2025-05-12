import { MyTask } from "../../types/types";

interface TeamTasksProps {
  tasks: MyTask[];
  onUpdate: (updatedTasks: MyTask[]) => void;
}

const TeamTasks: React.FC<TeamTasksProps> = ({ tasks, onUpdate }) => {
  const handleTaskChange = (index: number, value: string, field: keyof MyTask) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    );
    onUpdate(updatedTasks);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg font-bold text-gray-800">Tiimin Tehtävät</h2>
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
      )}
    </div>
  );
};

export default TeamTasks;