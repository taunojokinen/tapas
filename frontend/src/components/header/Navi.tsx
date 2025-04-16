import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCogs,
  FaChartBar,
  FaLightbulb,
  FaTasks,
} from "react-icons/fa";

const Navi: React.FC = () => {
  return (
    <nav className="h-[calc(100vh-8rem)] w-64 bg-gray-800 text-white fixed top-32 left-0 flex flex-col shadow-lg">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Navigation
      </div>
      <ul className="flex-grow space-y-4 p-4">
        <li>
          <Link
            to="/arvot"
            className="flex items-center px-4 py-3 rounded hover:bg-gray-700"
          >
            <FaChartBar className="text-green-500 text-2xl mr-4" />
            <span className="text-lg font-semibold">Arvot</span>
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className="flex items-center px-4 py-3 rounded hover:bg-gray-700"
          >
            <FaHome className="text-blue-500 text-2xl mr-4" />
            <span className="text-lg font-semibold">Yrityksen tavoitteet</span>
          </Link>
        </li>

        {/* <li>
          <Link
            to="/change_values"
            className="flex items-center px-4 py-3 rounded hover:bg-gray-700"
          >
            <FaTasks className="text-yellow-500 text-2xl mr-4" />
            <span className="text-lg font-semibold">Change Values</span>
          </Link>
        </li> */}
        <li>
          <Link
            to="/tiimin_tavoitteet"
            className="flex items-center px-4 py-3 rounded hover:bg-gray-700"
          >
            <FaLightbulb className="text-purple-500 text-2xl mr-4" />
            <span className="text-lg font-semibold">Tiimin tavoitteet</span>
          </Link>
        </li>
        <li>
          <Link
            to="/omat_tavoitteet"
            className="flex items-center px-4 py-3 rounded hover:bg-gray-700"
          >
            <FaLightbulb className="text-purple-500 text-2xl mr-4" />
            <span className="text-lg font-semibold">Omat tavoitteet</span>
          </Link>
        </li>
        <li>
          <Link
            to="/asetukset"
            className="flex items-center px-4 py-3 rounded hover:bg-gray-700"
          >
            <FaCogs className="text-red-500 text-2xl mr-4" />
            <span className="text-lg font-semibold">Asetukset</span>
          </Link>
        </li>
      </ul>
      <div className="p-4 text-sm border-t border-gray-700">© 2025 Tapas</div>
    </nav>
  );
};

export default Navi;
