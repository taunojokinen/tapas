import React from "react";
import { RowData } from "../../types/types"; // Varmista, että RowData-tyyppi on oikein importoitu

interface TableRowProps {
  row: RowData;
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  removeRow: (id: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ row, setRows, removeRow }) => {
  const updateRow = (field: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((r) => (r.id === row.id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          value={row.tehtava}
          onChange={(e) => updateRow("tehtava", e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={row.mittari}
          onChange={(e) => updateRow("mittari", e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={row.seuranta}
          onChange={(e) => updateRow("seuranta", e.target.value)}
        />
      </td>
      <td>
        <button onClick={() => removeRow(row.id)}>Poista</button>
      </td>
    </tr>
  );
};

export default TableRow;
