import React, { useState, useEffect } from "react";
import axios from "axios";
import StrategiatList from "./StrategiatList";

const Strategiat: React.FC = () => {
  interface Strategia {
    _id: string;
    nimi: string;
    mittari: string;
    seuranta: string;
  }

  const [strategiat, setStrategiat] = useState<Strategia[]>([]);
  const [uusiStrategia, setUusiStrategia] = useState<string>("");
  const [mittari, setMittari] = useState<string>("");
  const [seuranta, setSeuranta] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchStrategiat = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/strategiat");
      setStrategiat(response.data); // response.data sisältää objektit {_id, nimi, mittari, seuranta, __v}
      setLoading(false);
    } catch (err) {
      setError("Tietojen hakeminen epäonnistui.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategiat();
  }, []);

  const handleAddStrategia = async () => {
    if (!uusiStrategia || !mittari || !seuranta) return; // Tarkistetaan, että kaikki kentät on täytetty
    
    try {
      await axios.post("http://localhost:5000/api/strategiat", {
        nimi: uusiStrategia,
        mittari: mittari,
        seuranta: seuranta,
      });
      setUusiStrategia("");
      setMittari("");
      setSeuranta("");
      fetchStrategiat();
    } catch (error) {
      console.error("Virhe strategian lisäämisessä", error);
      setError("Strategian lisääminen epäonnistui.");
    }
  };

  const handleDeleteStrategia = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/strategiat/${id}`);
      fetchStrategiat();
    } catch (error) {
      setError("Strategian poistaminen epäonnistui.");
    }
  };

  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Strategiat</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          value={uusiStrategia}
          onChange={(e) => setUusiStrategia(e.target.value)}
          placeholder="Uusi strategia"
          className="p-2 border rounded-lg w-full"
        />
        <input
          type="text"
          value={mittari}
          onChange={(e) => setMittari(e.target.value)}
          placeholder="Mittari"
          className="p-2 border rounded-lg w-full"
        />
        <input
          type="text"
          value={seuranta}
          onChange={(e) => setSeuranta(e.target.value)}
          placeholder="Seuranta"
          className="p-2 border rounded-lg w-full"
        />
        <button onClick={handleAddStrategia} className="bg-green-500 text-white px-4 py-2 rounded">
          Lisää
        </button>
      </div>
      {loading ? (
        <p>Ladataan...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          
          <StrategiatList
            strategiat={strategiat}
            handleDeleteStrategia={handleDeleteStrategia}
          />
        </div>
      )}
    </div>
  );
};

export default Strategiat;
