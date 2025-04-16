import React, {  useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import SelectionList from "../components/tavoitteet/SelectionList";
import Table from "../components/tavoitteet/Table";
import axios from "axios";

interface Selection {
  _id: string;
  name: string;
  createdAt: string;
  // Lisää muita kenttiä, jos niitä on
}

const TiiminTavoitteet: React.FC = () => {
  const [selections, setSelections] = useState<Selection[]>([]); // Käytetään Selection-tyyppiä
  const [selectionName, setSelectionName] = useState<string>("");

  const { data: strategiat, setData: setStrategiat } = useFetch("strategiat");
  const { data: teams, setData: setTeams } = useFetch("teams");
  const { data: projects, setData: setProjects } = useFetch("projects");

  const [rows, setRows] = useState([
    {
      id: 1,
      miksi: "Päämäärä",
      paamaera: "Määrittele päämäärä",
      mita: "Mitä saavutetaan",
      tavoite: "Tavoite",
      miten: "Tehtävä",
      tehtava: "",
      mittari: "",
      seuranta: "",
      toimenpiteet: "",
    },
    {
      id: 2,
      miksi: "Mitä",
      paamaera: "",
      mita: "Määrittele mitä tehdään",
      tavoite: "Tavoite",
      miten: "Tehtävä",
      tehtava: "",
      mittari: "",
      seuranta: "",
      toimenpiteet: "",
    },
    {
      id: 3,
      miksi: "Tavoite",
      paamaera: "",
      mita: "",
      tavoite: "Määrittele tavoite",
      miten: "Tehtävä",
      tehtava: "",
      mittari: "",
      seuranta: "",
      toimenpiteet: "",
    },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        miksi: "Miten",
        paamaera: "",
        mita: "",
        tavoite: "",
        miten: "Tehtävä",
        tehtava: "",
        mittari: "",
        seuranta: "",
        toimenpiteet: "",
      },
    ]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleSaveSelections = async () => {
    try {
      const selectedData = {
        name: selectionName, // Valintakokonaisuuden nimi
        teams: teams.filter(t => t.selected), // Lähetetään koko objekti
        projects: projects.filter(p => p.selected), // Lähetetään koko objekti
        strategies: strategiat.filter(s => s.selected), // Lähetetään koko objekti
        tasks: rows.map(row => ({
          tehtava: row.tehtava,
          mittari: row.mittari,
          seuranta: row.seuranta,
          toimenpiteet: row.toimenpiteet
        }))
      };
  
      await axios.post(`${process.env.REACT_APP_API_URL}/api/selections`, selectedData);
      alert("Valinnat tallennettu!");
    } catch (error) {
      alert("Tallennus epäonnistui.");
    }
  };
  
  const toggleSelection = (type: "team" | "project" | "strategy", id: string) => {
    if (type === "team") {
      setTeams(teams.map(team => team._id === id ? { ...team, selected: !team.selected } : team));
    } else if (type === "project") {
      setProjects(projects.map(project => project._id === id ? { ...project, selected: !project.selected } : project));
    } else if (type === "strategy") {
      setStrategiat(strategiat.map(strategy => strategy._id === id ? { ...strategy, selected: !strategy.selected } : strategy));
    }  
  };

  const selectedStrategies = strategiat
  .filter(strategy => strategy.selected)
  .map(strategy => ({ nimi: strategy.nimi, mittari: strategy.mittari }));

  const fetchSelections = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/selections`);
      setSelections(response.data); // Tallenna haetut valintakokonaisuudet
    } catch (error) {
      console.error("Virhe haussa:", error);
    }
  };

  // Käytä tätä useEffectissa tai jossain muussa osassa UI:ta
  useEffect(() => {
    fetchSelections();
  }, []);
  
  return (
    <>

        <div>
          <h2>Aikaisemmin tallennetut tavoitteet: </h2>
          <ul>
          {selections.length > 0 ? (
              selections.map((selection) => (
                <li key={selection._id}>
                  <h3>{selection.name}</h3>
                  <p>Luotu: {new Date(selection.createdAt).toLocaleString()}</p>
                </li>
              ))
            ) : (
              <li>Tavoitteita ei löytynyt</li>
            )}
          </ul>
        </div>

        <div className="p-4 border rounded shadow-md bg-white">
        <h2 className="text-lg font-semibold mb-2">Strategiat</h2>
        <div className="space-y-2">
          {strategiat.map((strategy) => (
            <label key={strategy._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={strategy.selected}
                onChange={() => toggleSelection("strategy", strategy._id)}
                className="w-4 h-4"
              />
              <span className="text-gray-900">{strategy.nimi}</span> {/* Teksti näkyväksi */}
            </label>
          ))}
        </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex-1 p-4 border rounded shadow-md bg-white">  
            <SelectionList
              title="Tiimit"
              items={teams}
              toggleSelection={(id) => toggleSelection("team", id)}
            />
          </div>

          <div className="flex-1 p-4 border rounded shadow-md bg-white">
            <SelectionList
              title="Projektit"
              items={projects}
              toggleSelection={(id) => toggleSelection("project", id)}
            />
          </div>
        </div>

      <div>
        <Table 
          rows={rows} 
          setRows={setRows} 
          addRow={addRow} 
          removeRow={removeRow} 
          selectedStrategies={selectedStrategies} // Anna strategia Tablelle
        />
      
      </div>
      <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Tallennettavan tavoitesivun nimi:</h2>
      
      {/* Syötekenttä nimen asettamiseen */}
      <input
        type="text"
        value={selectionName}
        onChange={(e) => setSelectionName(e.target.value)}
        placeholder="Syötä nimi"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Tallenna valinnat */}
      <button onClick={handleSaveSelections} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Tallenna
      </button>
    </div>    </>
  );
};

export default TiiminTavoitteet;
