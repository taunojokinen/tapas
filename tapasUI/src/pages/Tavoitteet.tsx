import React, { useState, useEffect } from "react";
import axios from "axios";
import hoshin from '../pictures/hoshin.png';

interface Strategia {
  _id: string;
  nimi: string;
  mittari: string;
  seuranta: string;
  selected: boolean;
}

const Tavoitteet: React.FC = () => {
  const [vaiheet, setVaiheet] = useState([{ id: 1, vaihe1: "", vaihe2: "", vaihe3: "" }]);
  const [strategiat, setStrategiat] = useState<Strategia[]>([]);
  const [error, setError] = useState<string>("");
  const [paamaara, setPaamaara] = useState<string[]>([]);
  const addRow = () => {
    setVaiheet([...vaiheet, { id: vaiheet.length + 1, vaihe1: "", vaihe2: "", vaihe3: "" }]);
  };

  useEffect(() => {
    const fetchStrategiat = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/strategiat");
        console.log("Raw response data:", response.data);

        const data = response.data.map((strategy: any) => ({
          ...strategy,
          selected: false,
        }));
        setStrategiat(data);
        console.log("Processed data:", data);
      } catch (error) {
        console.error("Error fetching strategies:", error);
        setError("Error fetching strategies. Please try again later.");
      }
    };

    fetchStrategiat();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setStrategiat((prevStrategiat) =>
      prevStrategiat.map((strategia) =>
        strategia._id === id ? { ...strategia, selected: !strategia.selected } : strategia
      )
    );

    const selectedStrategia = strategiat.find((strategia) => strategia._id === id);
    if (selectedStrategia) {
      if (selectedStrategia.selected) {
        setPaamaara((prevPaamaara) => prevPaamaara.filter((nimi) => nimi !== selectedStrategia.nimi));
      } else {
        setPaamaara((prevPaamaara) => [...prevPaamaara, selectedStrategia.nimi]);
      }
    }
  };

  return (
    <>
    <div className="w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Strategies</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2">
          {strategiat.map((strategia) => (
            <li key={strategia._id} className="flex items-center space-x-2 p-2 border rounded-lg shadow-sm bg-gray-50">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={strategia.selected}
                  onChange={() => handleCheckboxChange(strategia._id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg">{strategia.nimi}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Tapas Johtamisavustin</h1>
        <p>Welcome to the Tavoite Page!</p>
        <img src={hoshin} alt="Hoshin-taulu" style={{ width: '50%', height: 'auto' }} className='header-logo' />
      </div>

      <div className="w-full p-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2" colSpan={2}>Nykytila</th>
            </tr>
          </thead>
          <tbody>
            {/* Jyvää ja Parannettevaa sarakkeet */}
            <tr>
              <td className="border border-gray-300 p-2 w-1/2">Hyvää</td>
              <td className="border border-gray-300 p-2 w-1/2">Parannettevaa</td>
            </tr>

            {/* Miksi ja Miten sarakkeet */}
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 w-1/3">Miksi</th>
              <th className="border border-gray-300 p-2 w-2/3">Miten</th>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 w-1/3">
                {/* Miksi sarakkeen rivit */}
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Päämäärä</td>
                    </tr>
                    {paamaara.map((nimi, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{nimi}</td>
                      </tr>
                    ))}
                    <tr>
                      <th className="border border-gray-300 p-2 w-1/3">Mitä</th>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Tavoite</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="border border-gray-300 p-2 w-2/3">
                {/* Miten sarakkeen kolme saraketta */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Tehtävä</th>
                      <th className="border border-gray-300 p-2">Mittari (KPI)</th>
                      <th className="border border-gray-300 p-2">Seuranta</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Tehtävä 1</td>
                      <td className="border border-gray-300 p-2">KPI 1</td>
                      <td className="border border-gray-300 p-2">Seuranta 1</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Tehtävä 2</td>
                      <td className="border border-gray-300 p-2">KPI 2</td>
                      <td className="border border-gray-300 p-2">Seuranta 2</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Tehtävä 3</td>
                      <td className="border border-gray-300 p-2">KPI 3</td>
                      <td className="border border-gray-300 p-2">Seuranta 3</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
    </>
  );
};

export default Tavoitteet;