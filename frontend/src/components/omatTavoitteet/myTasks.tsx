import React, { useState } from "react";
import { MyTask } from "../../types/types";
import { patchMyObjectiveData } from "./myObjectiveFunctions";

interface MyTasksProps {
  tasks: MyTask[]; // Array of tasks
  setTasks: React.Dispatch<React.SetStateAction<MyTask[]>>; // Function to update tasks
  username: string;
}

const MyTasks: React.FC<MyTasksProps> = ({ tasks, setTasks, username }) => {
  const [isEditing, setIsEditing] = useState(false); // Global editing state

  // Add a new task
  const handleAddTask = async () => {
    const newTask: MyTask = {
      nimi: "Uusi tehtävä", // Example value
      mittari: "Uusi deadline", // Example value
      seuranta: "Uusi status", // Example value
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    // Save changes
    interface MyObjectivesJson {
      tasks: MyTask[];
    }
    const payload: Partial<MyObjectivesJson> = { tasks: updatedTasks };
    await patchMyObjectiveData(username, payload);
  };

  // Delete a task
  const handleDeleteTask = async (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);

    // Save changes
    await patchMyObjectiveData(username, { tasks: updatedTasks });
  };

  // Move a task up or down
  const handleMoveTask = async (index: number, direction: "up" | "down") => {
    const newTasks = [...tasks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    // Swap tasks
    if (swapIndex >= 0 && swapIndex < tasks.length) {
      [newTasks[index], newTasks[swapIndex]] = [
        newTasks[swapIndex],
        newTasks[index],
      ];
      setTasks(newTasks);

      // Save changes
      await patchMyObjectiveData(username, { tasks: newTasks });
    }
  };

  // Update a task's text
  const handleTaskChange = async (
    index: number,
    newValue: string,
    field: "nimi" | "mittari" | "seuranta"
  ) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, [field]: newValue } : task
    );
    setTasks(updatedTasks);

    // Save changes
    await patchMyObjectiveData(username, { tasks: updatedTasks });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Omat Tehtävät</h2>
      <div className="w-full p-2 border border-gray-300 rounded mb-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index} className="mb-4 flex items-center gap-4">
              {/* Buttons in front of the row */}
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
              {/* Task fields */}
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
      {/* Edit/Save and Cancel Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 ${
            isEditing
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded`}
        >
          {isEditing ? "Tallenna" : "Muokkaa"}
        </button>
        {isEditing && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MyTasks;