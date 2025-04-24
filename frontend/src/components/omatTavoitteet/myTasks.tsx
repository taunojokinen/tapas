import React, { useState } from "react";

  interface MyTasksProps {
    myTasks: string[];
    setMyTasks: React.Dispatch<React.SetStateAction<string[]>>;
  }
  
  const MyTasks: React.FC<MyTasksProps> = ({ myTasks, setMyTasks }) => {
  const [isEditing, setIsEditing] = useState(false); // Global editing state

  // Add a new objective
  const handleAddMyTask = () => {
    const newMyTask = "Uusi tavoite";
    setMyTasks((prevMyTasks) => [...prevMyTasks, newMyTask]);
  };

  // Delete an objective
  const handleDeleteMyTask = (index: number) => {
    const updatedTasks = myTasks.filter((_, i) => i !== index);
    setMyTasks(updatedTasks);
  };

  // Move an objective up or down
  const handleMoveMyTask = (index: number, direction: "up" | "down") => {
    const newMyTasks = [...myTasks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    // Swap objectives
    [newMyTasks[index], newMyTasks[swapIndex]] = [
      newMyTasks[swapIndex],
      newMyTasks[index],
    ];

    setMyTasks(newMyTasks);
  };

  // Update an objective's text
  const handleMyTaskChange = (index: number, newValue: string) => {
    setMyTasks((prevMyTasks) =>
      prevMyTasks.map((myTask, i) =>
        i === index ? newValue : myTask
      )
    );
  };

  return (
  <div className="bg-white p-4 rounded-lg shadow mb-4">
    <h2 className="text-xl font-bold mb-4">Avaintehtävät</h2>
    <div className="w-full p-2 border border-gray-300 rounded mb-4">
    {myTasks.length > 0 ? (
      myTasks.map((myTask, index) => (
        <div key={index} className="mb-4 flex items-center gap-4">
          {/* Buttons in front of the row */}
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => handleMoveMyTask(index, "up")}
                disabled={index === 0}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ↑
              </button>
              <button
                onClick={() => handleMoveMyTask(index, "down")}
                disabled={index === myTasks.length - 1}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ↓
              </button>
              <button
                onClick={() => handleDeleteMyTask(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️
              </button>
            </div>
          )}
          {/* Objective text */}
          <div className="flex-grow">
            {isEditing ? (
              <input
                type="text"
                value={myTask}
                onChange={(e) =>
                  handleMyTaskChange(index, e.target.value)
                }
                className="text-lg border border-gray-300 rounded px-2 py-1 w-full"
              />
            ) : (
              <p className="text-lg">{myTask}</p>
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
            onClick={handleAddMyTask}
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
}
export default MyTasks;