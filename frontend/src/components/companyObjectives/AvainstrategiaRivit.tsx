import { FaTrash, FaPlus } from "react-icons/fa";
import { Strategia } from "../../types/types";

const AvainstrategiaRivit: React.FC<{
  strategiat: Strategia[];
  paivita: (uudet: Strategia[]) => void;
  isAuthorized: boolean;
}> = ({ strategiat, paivita, isAuthorized }) => {
  const muuta = (index: number, key: keyof Strategia, value: string) => {
    const kopio = [...strategiat];
    kopio[index][key] = value as any;
    paivita(kopio);
  };

  const vaihdaVari = (index: number) => {
    const seuraava = { green: "yellow", yellow: "red", red: "green" };
    muuta(index, "seuranta", seuraava[strategiat[index].seuranta]);
  };

  const lisaaRivi = () => {
    paivita([
      ...strategiat,
      { tavoite: "", omistaja: "", toimenpide: "", seuranta: "green" },
    ]);
  };

  const poistaRivi = (index: number) => {
    paivita(strategiat.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Avainstrategiat</h2>
      <div className="grid grid-cols-12 gap-4 font-semibold mb-2">
        <div className="col-span-4">Tavoite</div>
        <div className="col-span-2">Omistaja</div>
        <div className="col-span-4">Toimenpide</div>
        <div className="col-span-1">Seuranta</div>
        <div className="col-span-1" />
      </div>
      {strategiat.map((s, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 items-center mb-2">
          <input
            className="col-span-4 p-2 border rounded"
            value={s.tavoite}
            onChange={(e) => muuta(i, "tavoite", e.target.value)}
            readOnly={!isAuthorized}
          />
          <input
            className="col-span-2 p-2 border rounded"
            value={s.omistaja || ""}
            onChange={(e) => muuta(i, "omistaja", e.target.value)}
            readOnly={!isAuthorized}
          />
          <input
            className="col-span-4 p-2 border rounded"
            value={s.toimenpide}
            onChange={(e) => muuta(i, "toimenpide", e.target.value)}
            readOnly={!isAuthorized}
          />
          <select
            className="col-span-1 p-1 border rounded bg-white"
            value={s.seuranta}
            onChange={(e) => muuta(i, "seuranta", e.target.value)}
            disabled={!isAuthorized}
          >
            <option value="green">🟢 Vihreä</option>
            <option value="yellow">🟡 Keltainen</option>
            <option value="red">🔴 Punainen</option>
          </select>

          {isAuthorized && (
            <button
              onClick={() => poistaRivi(i)}
              className="p-2 text-red-600 hover:text-red-800"
              title="Poista rivi"
            >
              <FaTrash className="w-5 h-5" />
              <span className="sr-only">Poista rivi</span>
            </button>
          )}
        </div>
      ))}
      {isAuthorized && (
        <button
          onClick={lisaaRivi}
          className="flex items-center gap-1 text-green-600 hover:text-green-800"
          title="Lisää rivi"
        >
          <FaPlus className="w-5 h-5" />
          <span className="text-sm">Lisää rivi</span>
        </button>
      )}
    </div>
  );
};

export default AvainstrategiaRivit;
