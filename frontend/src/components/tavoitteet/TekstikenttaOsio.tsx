import { FaTrash, FaPlus } from "react-icons/fa";

type OsaTiedot = {
  otsikko: string;
  rivit: string[];
};

const TekstikenttaOsio: React.FC<
  OsaTiedot & {
    paivita: (rivit: string[]) => void;
    isAuthorized: boolean;
  }
> = ({ otsikko, rivit, paivita }) => {
  const lisaaRivi = () => paivita([...rivit, ""]);
  const poistaRivi = (indeksi: number) =>
    paivita(rivit.filter((_, i) => i !== indeksi));
  const paivitaRivi = (indeksi: number, uusiTeksti: string) => {
    const kopio = [...rivit];
    kopio[indeksi] = uusiTeksti;
    paivita(kopio);
  };
  const userRole = localStorage.getItem("role"); // esim. 'admin' tai 'manager'
  const isAuthorized = userRole === "admin" || userRole === "manager";

  return (
    <div className="mb-6 p-4 border border-gray-300 rounded">
      <h2 className="text-lg font-semibold mb-2">{otsikko}</h2>
      {rivit.map((rivi, indeksi) => (
        <div key={indeksi} className="flex items-center space-x-2 mb-2">
          <input
            value={rivi}
            onChange={(e) => paivitaRivi(indeksi, e.target.value)}
            className="flex-1 p-2 border rounded"
            readOnly={!isAuthorized}
          />
          {isAuthorized && (
            <button
              onClick={() => poistaRivi(indeksi)}
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

export default TekstikenttaOsio;
