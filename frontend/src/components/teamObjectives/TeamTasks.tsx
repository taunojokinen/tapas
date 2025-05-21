import React, { useState } from "react";
import { MyTask } from "../../types/types";

interface Props {
  tasks: MyTask[];
  onTasksChange?: (tasks: MyTask[]) => void; // Optional callback for parent sync
}

const TeamTasks: React.FC<Props> = ({ tasks: initialTasks, onTasksChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState<MyTask[]>(initialTasks);

  // Sync with parent if tasks prop changes
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleTaskChange = (index: number, value: string, field: keyof MyTask) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
  };

  const handleMoveTask = (index: number, direction: "up" | "down") => {
    const newTasks = [...tasks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newTasks[index], newTasks[swapIndex]] = [newTasks[swapIndex], newTasks[index]];
    setTasks(newTasks);
    onTasksChange?.(newTasks);
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
  };

  const handleAddTask = () => {
    const newTask: MyTask = { nimi: "", mittari: "", seuranta: "" };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
  };

  const handleSave = () => {
    setIsEditing(false);
    onTasksChange?.(tasks);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Tiimin Tehtävät</h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`px-4 py-2 ${
            isEditing
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded`}
        >
          {isEditing ? "Tallenna" : "Muokkaa"}
        </button>
      </div>
      <div className="w-full p-2 border border-gray-300 rounded mb-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index} className="mb-4 flex items-center gap-4">
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveTask(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveTask(index, "down")}
                    disabled={index === tasks.length - 1}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleDeleteTask(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>
              )}
              <div className="flex-grow grid grid-cols-3 gap-4">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={task.nimi}
                      onChange={(e) =>
                        handleTaskChange(index, e.target.value, "nimi")
                      }
                      className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    <input
                      type="text"
                      value={task.mittari}
                      onChange={(e) =>
                        handleTaskChange(index, e.target.value, "mittari")
                      }
                      className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    <select
                      value={task.seuranta}
                      onChange={(e) =>
                        handleTaskChange(index, e.target.value, "seuranta")
                      }
                      className="w-full p-1 border"
                    >
                      <option value="">Valitse</option>
                      <option value="Aloitettu">🟡 Aloitettu</option>
                      <option value="Aloittamatta">🔴 Aloittamatta</option>
                      <option value="Kesken">🟠 Kesken</option>
                      <option value="Valmis">🟢 Valmis</option>
                    </select>
                  </>
                ) : (
                  <>
                    <p className="text-lg">{task.nimi}</p>
                    <p className="text-lg">{task.mittari}</p>
                    <p className="text-lg">
                      {task.seuranta === "Aloitettu" && "🟡 Aloitettu"}
                      {task.seuranta === "Aloittamatta" && "🔴 Aloittamatta"}
                      {task.seuranta === "Kesken" && "🟠 Kesken"}
                      {task.seuranta === "Valmis" && "🟢 Valmis"}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Ei tehtäviä.</p>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Lisää uusi tehtävä
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Peruuta
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamTasks;