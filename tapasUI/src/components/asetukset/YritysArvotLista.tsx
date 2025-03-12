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

const YritysArvotLista: React.FC<{
  kaikkiArvot: YritysArvot[];
  handleDelete: (id: string) => void;
  handleDeleteSingleArvo: (yritysId: string, arvoIndex: number) => void;
  loading: boolean;
  error: string;
}> = ({ kaikkiArvot, handleDelete, handleDeleteSingleArvo, loading, error }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Yrityksen Arvot</h2>
      {loading ? <p>Ladataan...</p> : error ? <p>{error}</p> : (
        <ul className="space-y-4">
          {kaikkiArvot.map((yritys) => (
            <li key={yritys._id} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <strong>{yritys.yritys}</strong>
              <ul>
                {yritys.arvot.map((arvo, index) => (
                  <li key={index} className="flex justify-between">
                    {arvo.nimi}: {arvo.kuvaus} (Tärkeys: {arvo.tärkeys})
                    <button onClick={() => handleDeleteSingleArvo(yritys._id, index)} className="bg-red-500 text-white px-2 py-1 rounded">Poista</button>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleDelete(yritys._id)} className="mt-2 bg-red-600 text-white px-4 py-2 rounded">Poista kaikki arvot</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YritysArvotLista;