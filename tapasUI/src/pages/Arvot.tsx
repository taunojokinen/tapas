
import React, { useState, useEffect } from "react";
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

const Arvot: React.FC = () => {
  const [yritys, setYritys] = useState<string>(""); // Yrityksen nimi
  const [arvot, setArvot] = useState<Arvo[]>([]); // Yrityksen arvot (taulukko)
  const [kaikkiArvot, setKaikkiArvot] = useState<YritysArvot[]>([]); // Kaikki arvot tietokannasta
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  /** 🔄 Haetaan yrityksen arvot tietokannasta */
  const fetchArvot = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/arvot");

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


  return (
    <>
      <div>
        
        {message && <p>{message}</p>}
      </div>
      <div>
        <h2>Yrityksen Arvot</h2>
        {loading ? (
          <p>Ladataan...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {kaikkiArvot.map((yritys: YritysArvot) => (
              <li key={yritys._id}>
                <strong>{yritys.yritys}</strong>
                <ul>
                  {yritys.arvot.map((arvo: Arvo, index: number) => (
                    <li key={index}>
                      {arvo.nimi}: {arvo.kuvaus} (Tärkeys: {arvo.tärkeys})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

};

export default Arvot;
