import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Values } from "../../types/types";

const RenderCurrentValues: React.FC<{
  values: Values[];
  setValues: React.Dispatch<React.SetStateAction<Values[]>>;
}> = ({ values, setValues }) => {
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

  const handleMoveValue = (index: number, direction: "up" | "down") => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      const [movedValue] = newValues.splice(index, 1); // Remove the value at the current index
      const newIndex = direction === "up" ? index - 1 : index + 1; // Calculate the new index
      newValues.splice(newIndex, 0, movedValue); // Insert the value at the new index
      return newValues;
    });
  };

  /** Remove a value from the list */
  const handleRemoveValue = (index: number) => {
    setValues((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  /** Add a new value to the list */
  const handleAddValue = () => {
    const newValue: Values = {
      tärkeys: 0,
      nimi: "Uusi arvo",
      kuvaus: "Kuvaus uudelle arvolle",
    };
    setValues((prevValues) => [...prevValues, newValue]);
  };

  /** Navigate back to the Arvot page */
  const handleBack = () => {
    navigate("/arvot"); // Navigate to the Arvot page
  };

  const updateValues = async () => {
    try {
      // Send updated values to the backend
      const jsonData = { values };
      console.log("Päivitetyt arvot:", jsonData); // Log the updated values
      await axios.put(`${process.env.REACT_APP_API_URL}/api/values`, jsonData);

      alert("Arvot päivitettiin onnistuneesti!");
    } catch (err) {
      console.error("Virhe arvotietojen päivittämisessä:", err);
      alert("Arvojen päivittäminen epäonnistui. Yritä uudelleen.");
    }
  };

  return (
    <div className="relative">
      {/* <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT</h1> */}

      <div className="mt-6">
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Yrityksen nykyiset arvot</h2>
          {values.length > 0 ? (
            values.map((value, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                {/* Buttons in front of the row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveValue(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveValue(index, "down")}
                    disabled={index === values.length - 1}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleRemoveValue(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                  <h1>
                    <strong>{index + 1}</strong>
                  </h1>
                </div>
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
        <div className="mt-4">
          <div className="mt-4 flex flex-wrap gap-4 justify-between">
            <button
              onClick={() => handleAddValue()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Lisää arvo
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Palaa päivittämättä arvoja
            </button>
            <button
              onClick={updateValues}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Päivitä arvot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderCurrentValues;
