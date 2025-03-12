import React, { useState } from "react";
import hoshin from '../pictures/hoshin.png';

const Tavoitteet: React.FC = () => {
    const [vaiheet, setVaiheet] = useState([{ id: 1, vaihe1: "", vaihe2: "", vaihe3: "" }]);

    const addRow = () => {
      setVaiheet([...vaiheet, { id: vaiheet.length + 1, vaihe1: "", vaihe2: "", vaihe3: "" }]);
    };
    return (
        <>
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Tavoite Page!</p>
            <img src={hoshin} alt="Hoshin-taulu" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>

        <div className="w-full p-6">
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 p-2" colSpan={2}>Nykytila</th>
      </tr>
    </thead>
    <tbody>
      {/* Jyvää ja Parannettevaa sarakkeet */}
      <tr>
        <td className="border border-gray-300 p-2 w-1/2">Hyvää</td>
        <td className="border border-gray-300 p-2 w-1/2">Parannettevaa</td>
      </tr>

      {/* Miksi ja Miten sarakkeet */}
      <tr className="bg-gray-200">
        <th className="border border-gray-300 p-2 w-1/3">Miksi</th>
        <th className="border border-gray-300 p-2 w-2/3">Miten</th>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2 w-1/3">
          {/* Miksi sarakkeen rivit */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Päämäärä</td>
              </tr>
              <tr>
              <th className="border border-gray-300 p-2 w-1/3">Mitä</th>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Tavoite</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td className="border border-gray-300 p-2 w-2/3">
          {/* Miten sarakkeen kolme saraketta */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Tehtävä</th>
                <th className="border border-gray-300 p-2">Mittari (KPI)</th>
                <th className="border border-gray-300 p-2">Seuranta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Tehtävä 1</td>
                <td className="border border-gray-300 p-2">KPI 1</td>
                <td className="border border-gray-300 p-2">Seuranta 1</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Tehtävä 2</td>
                <td className="border border-gray-300 p-2">KPI 2</td>
                <td className="border border-gray-300 p-2">Seuranta 2</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Tehtävä 3</td>
                <td className="border border-gray-300 p-2">KPI 3</td>
                <td className="border border-gray-300 p-2">Seuranta 3</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>

        </>
    );
};

export default Tavoitteet;