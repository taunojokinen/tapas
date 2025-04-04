import React, { useState, useEffect } from 'react';

// Määritellään Strategia-tyyppi, joka sisältää myös mittari ja seuranta
type Strategia = {
  _id: string;
  nimi: string;
  mittari: string;
  seuranta: string;
};

const StrategiatSummary: React.FC = () => {
  const [strategiat, setStrategiat] = useState<Strategia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Haetaan strategiat API:sta
  useEffect(() => {
    const fetchStrategiat = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/strategiat`);
        if (!response.ok) {
          throw new Error('Verkkovirhe, ei voitu ladata strategioita');
        }
        const data = await response.json();
        setStrategiat(data); // Asetetaan haettu data stateen
      } catch (error: any) {
        setError(error.message); // Virheiden käsittely
      } finally {
        setLoading(false); // Lataaminen valmis
      }
    };

    fetchStrategiat();
  }, []); // Tyhjä riippuvuuslista tarkoittaa, että data haetaan vain kerran komponentin latautuessa

  // Lataa tiedot
  if (loading) {
    return <div>Ladataan strategioita...</div>;
  }

  // Näytetään virhe, jos API-kutsu epäonnistui
  if (error) {
    return <div>Virhe: {error}</div>;
  }

  return (
    <div>
      <h2><strong>Avainstrategiat</strong></h2>
      <ul className="space-y-2">
        {strategiat.map((strategia) => (
          <li key={strategia._id} className="p-2 bg-gray-100 rounded-lg">
            {/* Näytetään strategian nimi, mittari ja seuranta */}
            <div>
              <strong>{strategia.nimi}</strong>
            </div>
            <div>
              <strong>Mittari:</strong> {strategia.mittari}
            </div>
            <div>
              <strong>Seuranta:</strong> {strategia.seuranta}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StrategiatSummary;
