import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Arvo {
    nimi: string;
    kuvaus: string;
    tärkeys: number;
  }
  
  interface YritysArvot {
    _id: string;
    yritys: string;
    arvot: Arvo[];
  }
const ChangeValues: React.FC = () => {
    const [kaikkiArvot, setKaikkiArvot] = useState<YritysArvot[]>([]); // Kaikki arvot tietokannasta
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate(); // Initialize useNavigate
  
    /** 🔄 Haetaan yrityksen arvot tietokannasta */
    const fetchArvot = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/arvot`);
  
        // Varmistetaan, että data on taulukko
        const data = Array.isArray(response.data) ? response.data : [];
        setKaikkiArvot(data);
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

    /** Navigate back to the Arvot page */
    const handleBack = () => {
        navigate("/arvot"); // Navigate to the Arvot page
      };

  return (

        // <div className="w-screen h-screen bg-blue-100 flex flex-col items-center justify-center">
        <div className="relative bg-blue-300 w-[70vw] h-[70vh] rounded-2xl p-4">
    <div
      className="absolute bg-white w-[calc(70vw-2rem)] h-[calc(70vh-2rem)] rounded-2xl p-4
      "
    >
            <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT</h1>
            {kaikkiArvot.map((yritys) =>
              yritys.arvot.map((arvo, index) => (
                <div key={`${yritys._id}-${index}`} className="mb-4">
                  <p className="text-lg font-bold">{arvo.nimi}</p>
                  <p className="text-sm">{arvo.kuvaus}</p>
                </div>
              ))
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
    {/* Back Button */}
    <div className="absolute bottom-4 right-4">
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Takaisin
      </button>
    </div>
  </div>
      );
};

export default ChangeValues;