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
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/values`
      );

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
    <>
      <div
        className="absolute bg-white w-[calc(70vw-2rem)] h-[calc(70vh-2rem)] rounded-2xl p-4 cursor-pointer"
        onClick={handleNavigate}
      >
        <h2 className="text-xl font-bold text-gray-800">ARVOT</h2>

        {values.length > 0 ? (
          values.map((value, index) => (
            <div key={value._id || index} className="mb-4">
              <p className="text-lg font-bold">{value.nimi}</p>
              <p className="text-sm">{value.kuvaus}</p>
            </div>
          ))
        ) : (
          <p>Ei arvoja näytettäväksi.</p>
        )}

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
    </>
  );
};

export default Arvot;
