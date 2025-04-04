import React from "react";

interface TableProps {
  rows: Array<{
    id: number;
    tehtava: string;
    mittari: string;
    seuranta: string;
    toimenpiteet: string;
  }>;
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  addRow: () => void;
  removeRow: (id: number) => void;
  selectedStrategies: { nimi: string, mittari: string }[];
}

const Table: React.FC<TableProps> = ({ rows, setRows, addRow, removeRow, selectedStrategies }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, rowId: number, field: string) => {
    const value = e.target.value;
    setRows(rows.map(row => row.id === rowId ? { ...row, [field]: value } : row));
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-lg border p-2 font-bold  bg-gray-200 mb-2">Nykytila</h2>
      <tr>
        <th className="border-collapse p-2 text-center" style={{ width: '50%' }}>Hyvää</th>
        <th className="border-collapse p-2 text-center" style={{ width: '50%' }}>Parannettavaa</th>
        </tr>
      <table className="border-collapse w-full text-left">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-200 w-1/2">Miksi</th>
            <th className="border p-2 bg-gray-200 w-1/2">Miten</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">
              Päämäärä: {selectedStrategies.length > 0 ? (
                <ul>
                  {selectedStrategies.map((strategy, index) => (
                    <li key={index}>{strategy.nimi}</li>
                  ))}
                </ul>
              ) : (
                "Ei valittuja strategioita"
              )}
            </td>
            <td rowSpan={rows.length + 1} className="border p-2 align-top">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border p-2">Tehtävä</th>
                    <th className="border p-2">Mittari</th>
                    <th className="border p-2">Seuranta</th>
                    <th className="border p-2">Toiminnot</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={row.tehtava}
                          onChange={(e) => handleChange(e, row.id, "tehtava")}
                          className="w-full p-1 border"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={row.mittari}
                          onChange={(e) => handleChange(e, row.id, "mittari")}
                          className="w-full p-1 border"
                        />
                      </td>
                      <td className="border p-2">
                        <select
                          value={row.seuranta}
                          onChange={(e) => handleChange(e, row.id, "seuranta")}
                          className="w-full p-1 border"
                        >
                          <option value="">Valitse</option>
                          <option value="Punainen">🔴 Punainen</option>
                          <option value="Keltainen">🟡 Keltainen</option>
                          <option value="Vihreä">🟢 Vihreä</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <button onClick={() => removeRow(row.id)} className="text-red-500">Poista</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addRow} className="mt-2 p-2 bg-blue-500 text-white rounded">Lisää rivi Miten</button>
            </td>
          </tr>
          <tr><td className="border p-2">Mitä</td></tr>
          <tr><td className="border p-2">
              Tavoite: {selectedStrategies.length > 0 ? (
                <ul>
                  {selectedStrategies.map((strategy, index) => (
                    <li key={index}>{strategy.mittari}</li>
                  ))}
                </ul>
              ) : (
                "Ei valittuja strategioita"
              )}
            </td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
