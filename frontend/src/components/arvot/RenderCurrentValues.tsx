import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Values } from "../../types/types";


const RenderCurrentValues: React.FC = () => {
  const [values, setValues] = useState<Values[]>([]); // Yrityksen arvot
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Virhetilanne
  const navigate = useNavigate(); // Initialize useNavigate

  /** 🔄 Haetaan yrityksen arvot tietokannasta */
  const fetchArvot = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/values`
      );

      // Varmistetaan, että data on taulukko
      const data = Array.isArray(response.data) ? response.data : [];
      setValues(data);

      console.log("Arvot:", values); // Log arvot
      setLoading(false);
    } catch (err) {
      setError("Tietojen hakeminen epäonnistui.");
      console.error("Virhe:", err);
      setLoading(false);
    }
  }, []);
  /** ⏳ Haetaan arvot **vain kerran** kun komponentti renderöityy */
  useEffect(() => {
    fetchArvot();
  }, [fetchArvot]);

  /** Navigate back to the Arvot page */
  const handleBack = () => {
    navigate("/arvot"); // Navigate to the Arvot page
  };


  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT</h1>

      <div className="mt-6">
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Yrityksen nykyiset arvot</h2>
          {values.length > 0 ? (
            values.map((value, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                {/* Buttons in front of the row */}
                <div className="flex gap-2">
                  <button
                    // onClick={() => handleMoveValue(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↑
                  </button>
                  <button
                    // onClick={() => handleMoveValue(index, "down")}
                    disabled={index === values.length - 1}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↓
                  </button>
                  <button
                    // onClick={() => handleRemoveValue(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                  <h1><strong>{index + 1}</strong></h1>
                </div>
                

      {/* Editable Value Details */}
      <div>
      
        <input
          type="text"
          value={value.nimi}
          onChange={(e) =>
            setValues((prevValues) =>
              prevValues.map((v, i) =>
                i === index ? { ...v, nimi: e.target.value } : v
              )
            )
          }
          className="text-lg font-bold border border-gray-300 rounded px-2 py-1"
        />
        <textarea
          value={value.kuvaus}
          onChange={(e) =>
            setValues((prevValues) =>
              prevValues.map((v, i) =>
                i === index ? { ...v, kuvaus: e.target.value } : v
              )
            )
          }
          className="text-sm border border-gray-300 rounded px-2 py-1 mt-1 w-full"
        />
      </div>
    </div>
  ))
          ) : (
            <p>Ei arvoja saatavilla.</p>
          )}

          </div>
        </div>
      </div>

  );
};

export default RenderCurrentValues;
