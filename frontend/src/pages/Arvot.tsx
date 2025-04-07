import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Values {
  tärkeys: number;
  nimi: string;
  kuvaus: string;
  _id: string;
}


const Arvot: React.FC = () => {
  const [values, setValues] = useState<Values[]>([]); // Kaikki arvot tietokannasta
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  /** 🔄 Haetaan yrityksen arvot tietokannasta */
  const fetchArvot = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/values`);

      // Varmistetaan, että data on taulukko
      const data = Array.isArray(response.data) ? response.data : [];
      setValues(data);
      setLoading(false);
    } catch (err) {
      setError("Tietojen hakeminen epäonnistui.");
      console.error("Virhe:", err);
      setLoading(false);
    }
  };

  /** ⏳ Haetaan arvot **vain kerran** kun komponentti renderöityy */
  useEffect(() => {
    fetchArvot();
  }, []);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/change_values");
  };


  return (
    // <div className="w-screen h-screen bg-blue-100 flex flex-col items-center justify-center">
    <div className="relative bg-blue-300 w-[70vw] h-[70vh] rounded-2xl p-4">
<div
  className="absolute bg-white w-[calc(70vw-2rem)] h-[calc(70vh-2rem)] rounded-2xl p-4 cursor-pointer"
  onClick={handleNavigate}
>
        <h1 className="text-2xl font-bold mb-4">ARVOT</h1>
        {values.length > 0 ? (
    values.map((value, index) => (
      <div key={value._id || index} className="mb-4">
        <p className="text-lg font-bold">{value.nimi}</p>
        <p className="text-sm">{value.kuvaus}</p>
        <p className="text-sm text-gray-500">Tärkeys: {value.tärkeys}</p>
      </div>
    ))
  ) : (
    <p>Ei arvoja näytettäväksi.</p>
  )}
      </div>
    {/* </div> */}
    <div className="mt-4">
      {loading ? (
        <p>Ladataan...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Data loaded successfully!</p>
      )}
    </div>
  </div>
  );
}

export default Arvot;
