import React, { useState, useEffect } from "react";
import axios from "axios";
import YritysArvotLista from './YritysArvotLista';

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

const ArvojenAsetus: React.FC = () => {
  const [yritys, setYritys] = useState<string>("");
  const [arvot, setArvot] = useState<Arvo[]>([]);
  const [kaikkiArvot, setKaikkiArvot] = useState<YritysArvot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const fetchArvot = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/arvot`);
      const data = Array.isArray(response.data) ? response.data : [];
      setKaikkiArvot(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jsonData = { yritys, arvot };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/arvot`, jsonData);
      setMessage(response.data.message);
      setYritys("");
      setArvot([]);
      await fetchArvot();
    } catch (error) {
      setMessage("Virhe datan lähettämisessä.");
      console.error("Virhe:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/arvot/${id}`);
      fetchArvot();
    } catch (error) {
      console.error("Virhe poistamisessa:", error);
    }
  };

  const handleDeleteSingleArvo = async (yritysId: string, arvoIndex: number) => {
    try {
      const yritys = kaikkiArvot.find(y => y._id === yritysId);
      if (!yritys) return;

      const updatedArvot = yritys.arvot.filter((_, index) => index !== arvoIndex);
      await axios.put(`${process.env.REACT_APP_API_URL}/api/arvot/${yritysId}`, { arvot: updatedArvot });
      fetchArvot();
    } catch (error) {
      console.error("Virhe yksittäisen arvon poistamisessa:", error);
    }
  };

  return (
    <>
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Lisää Yrityksen Arvot</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Yrityksen nimi:</label>
            <input
              type="text"
              value={yritys}
              onChange={(e) => setYritys(e.target.value)}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Yrityksen arvot:</label>
            {arvot.map((arvo, index) => (
              <div key={index} className="flex space-x-2">
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
                  className="p-2 border rounded-lg"
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
                  className="p-2 border rounded-lg"
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
                  className="p-2 border rounded-lg"
                />
                <button type="button" onClick={() => setArvot(arvot.filter((_, i) => i !== index))} className="bg-red-500 text-white px-2 py-1 rounded">Poista</button>
              </div>
            ))}
            <button type="button" onClick={() => setArvot([...arvot, { nimi: "", kuvaus: "", tärkeys: 1 }])} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Lisää arvo</button>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Lähetä</button>
        </form>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
      <YritysArvotLista kaikkiArvot={kaikkiArvot} handleDelete={handleDelete} handleDeleteSingleArvo={handleDeleteSingleArvo} loading={loading} error={error} />

    </>
  );
};

export default ArvojenAsetus;