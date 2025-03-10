import React, { useEffect, useState } from "react";

const CurrentState: React.FC = () => {
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [newPro, setNewPro] = useState<string>("");
  const [newCon, setNewCon] = useState<string>("");

  // Hae pros ja cons MongoDB:stä
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/proscons");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setPros(data.pros || []);
      setCons(data.cons || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lisää pro kantaan
  const addPro = async () => {
    if (newPro.trim()) {
      await fetch("http://localhost:5000/api/proscons/add-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pro: newPro }),
      });
      setNewPro("");
      fetchData();
    }
  };

  // Lisää con kantaan
  const addCon = async () => {
    if (newCon.trim()) {
      await fetch("http://localhost:5000/api/proscons/add-con", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ con: newCon }),
      });
      setNewCon("");
      fetchData();
    }
  };

  // Poista pro
const removePro = async (index: number) => {
    try {
      const response = await fetch("http://localhost:5000/api/proscons/delete-pro", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pro: pros[index] }),
      });
  
      if (!response.ok) throw new Error("Failed to delete");
  
      fetchData(); // Päivitä lista
    } catch (error) {
      console.error("Error deleting pro:", error);
    }
  };
  
  // Poista con
  const removeCon = async (index: number) => {
    try {
      const response = await fetch("http://localhost:5000/api/proscons/delete-con", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ con: cons[index] }),
      });
  
      if (!response.ok) throw new Error("Failed to delete");
  
      fetchData(); // Päivitä lista
    } catch (error) {
      console.error("Error deleting con:", error);
    }
  };

  // Muokkaa pro
  const editPro = async (index: number, newValue: string) => {
    await fetch("http://localhost:5000/api/proscons/edit-pro", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPro: pros[index], newPro: newValue }),
    });
    fetchData();
  };

  // Muokkaa con
  const editCon = async (index: number, newValue: string) => {
    await fetch("http://localhost:5000/api/proscons/edit-con", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldCon: cons[index], newCon: newValue }),
    });
    fetchData();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-4">Nykytila</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* PROS */}
        <div className="p-4 border rounded-lg shadow-sm bg-green-50">
          <h3 className="text-xl font-semibold mb-2">Pros</h3>
          <ul>
            {pros.map((pro, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => editPro(index, e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <button
                  onClick={() => removePro(index)}
                  className="ml-2 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newPro}
              onChange={(e) => setNewPro(e.target.value)}
              placeholder="Add a pro"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={addPro}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* CONS */}
        <div className="p-4 border rounded-lg shadow-sm bg-red-50">
          <h3 className="text-xl font-semibold mb-2">Cons</h3>
          <ul>
            {cons.map((con, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => editCon(index, e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <button
                  onClick={() => removeCon(index)}
                  className="ml-2 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newCon}
              onChange={(e) => setNewCon(e.target.value)}
              placeholder="Add a con"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={addCon}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentState;
