import React from 'react';

// Määritellään Strategia-tyyppi, jossa on myös mittari ja seuranta
type Strategia = {
  _id: string;
  nimi: string;
  mittari: string;
  seuranta: string;
};

// Määritellään komponentin propsit
type StrategiatListProps = {
  strategiat: Strategia[];
  handleDeleteStrategia: (id: string) => void;
};

const StrategiatList: React.FC<StrategiatListProps> = ({ strategiat, handleDeleteStrategia }) => {
  return (
    <ul className="space-y-2">
      {strategiat.map((strategia) => (
        <li key={strategia._id} className="flex justify-between p-2 bg-gray-100 rounded-lg">
          <div>
            <div>
              <strong>{strategia.nimi}</strong>
            </div>
            {/* Näytetään Mittari ja Seuranta kentät */}
            <div>
              <strong>Mittari:</strong> {strategia.mittari}
            </div>
            <div>
              <strong>Seuranta:</strong> {strategia.seuranta}
            </div>
          </div>
          <button
            onClick={() => handleDeleteStrategia(strategia._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Poista
          </button>
        </li>
      ))}
    </ul>
  );
};

export default StrategiatList;
