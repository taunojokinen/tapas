import React from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-8">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotAuthorized;
