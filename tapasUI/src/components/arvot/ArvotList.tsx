import { useState, useEffect } from 'react';
import axios from 'axios';

interface YritysArvot {
  nimi: string;
  kuvaus: string;
}

const ArvotList = () => {
  const [kaikkiArvot, setKaikkiArvot] = useState<YritysArvot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchArvot = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/arvot");

      console.log("Haettu data:", response.data); // Debuggaa datan tarkistamiseen

      // Oletetaan, että arvot ovat ensimmäisessä objektissa "arvot" kentässä
      const arvot = response.data.length > 0 ? response.data[0].arvot : [];
      setKaikkiArvot(arvot);
      setLoading(false);
    } catch (err) {
      setError("Tietojen hakeminen epäonnistui.");
      console.error("Virhe:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArvot();
  }, []);

  if (loading) {
    return <p>Ladataan arvoja...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4 p-4">
        <h2 className="text-2xl font-bold text-center mb-4">Avainstrategiat</h2>
      {kaikkiArvot.length === 0 ? (
        <p>Ei arvoja saatavilla.</p>
      ) : (
        kaikkiArvot.map((arvo, index) => (
          <div key={index} className="bg-white p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{arvo.nimi}</h3>  
            <p className="text-gray-600">{arvo.kuvaus}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ArvotList;
