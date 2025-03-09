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

  /** 📌 Lomakkeen käsittely */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const jsonData = { yritys, arvot };
      const response = await axios.post("http://localhost:5000/api/arvot", jsonData);

      setMessage(response.data.message);
      setYritys("");
      setArvot([]); // Nollataan lomake

      await fetchArvot(); // Päivitetään UI uusilla tiedoilla
    } catch (error) {
      setMessage("Virhe datan lähettämisessä.");
      console.error("Virhe:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Lisää Yrityksen Arvot</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Yrityksen nimi:</label>
            <input
              type="text"
              value={yritys}
              onChange={(e) => setYritys(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Yrityksen arvot:</label>
            {arvot.map((arvo, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Nimi"
                  value={arvo.nimi}
                  onChange={(e) => {
                    const newArvot = [...arvot];
                    newArvot[index].nimi = e.target.value;
                    setArvot(newArvot);
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Kuvaus"
                  value={arvo.kuvaus}
                  onChange={(e) => {
                    const newArvot = [...arvot];
                    newArvot[index].kuvaus = e.target.value;
                    setArvot(newArvot);
                  }}
                  required
                />
                <input
                  type="number"
                  placeholder="Tärkeys"
                  value={arvo.tärkeys}
                  onChange={(e) => {
                    const newArvot = [...arvot];
                    newArvot[index].tärkeys = Number(e.target.value);
                    setArvot(newArvot);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    const newArvot = arvot.filter((_, i) => i !== index);
                    setArvot(newArvot);
                  }}
                >
                  Poista
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setArvot([...arvot, { nimi: "", kuvaus: "", tärkeys: 1 }])
              }
            >
              Lisää arvo
            </button>
          </div>
          <br />
          <button type="submit">Lähetä</button>
        </form>
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
