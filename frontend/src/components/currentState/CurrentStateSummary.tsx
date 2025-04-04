import React, { useEffect, useState } from "react";

const Summary: React.FC = () => {
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  // Hae pros & cons MongoDB:stä
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/proscons`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setPros(data.pros || []);
      setCons(data.cons || []);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  // Hae data ensimmäisellä renderöinnillä ja päivityksen jälkeen
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); // Päivitä tiedot 2s välein
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-8xl mx-auto bg-gray-100 shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-4">Nykytila</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* PROS */}
        <div className="p-4 border rounded-lg shadow-sm bg-green-50">
          <h3 className="text-lg font-semibold mb-2">Pros ({pros.length})</h3>
          <ul className="list-disc pl-5">
            {pros.length > 0 ? (
              pros.map((pro, index) => <li key={index} className="text-green-700">{pro}</li>)
            ) : (
              <p className="text-gray-500">No pros added yet</p>
            )}
          </ul>
        </div>

        {/* CONS */}
        <div className="p-4 border rounded-lg shadow-sm bg-red-50">
          <h3 className="text-lg font-semibold mb-2">Cons ({cons.length})</h3>
          <ul className="list-disc pl-5">
            {cons.length > 0 ? (
              cons.map((con, index) => <li key={index} className="text-red-700">{con}</li>)
            ) : (
              <p className="text-gray-500">No cons added yet</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Summary;
