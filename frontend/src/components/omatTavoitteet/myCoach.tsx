import React, { useEffect } from "react";
import { fetchUserTitlesByUsername } from "./myObjectiveFunctions"; // Adjust the path if needed

interface MyCoachProps {
  title: string;
  user: string;
  isEditingTitle: boolean;
  newTitle: string;
  setNewTitle: (value: string) => void;
  handleSaveTitle: () => void;
  setIsEditingTitle: (value: boolean) => void;
}

const MyCoach: React.FC<MyCoachProps> = ({
  title,
  user,
  isEditingTitle,
  newTitle,
  setNewTitle,
  handleSaveTitle,
  setIsEditingTitle,
}) => {
  // Fetch and update the title from backend using fetchUserTitlesByUsername
  const fetchAndSetTitle = async () => {
    if (user) {
      const titles = await fetchUserTitlesByUsername(user);
      if (titles && titles.length > 0) {
        setNewTitle(titles[0]); // Set the first title found
      }
    }
  };

  // Optionally, fetch the title when editing starts
  useEffect(() => {
    if (isEditingTitle) {
      fetchAndSetTitle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingTitle, user]);

  return (
    <div>
      <div className="flex items-center justify-between p-4  shadow mb-0 ml-4">
        <h2 className="text-xl font-bold text-gray-800">
          {title} {user} - omat tavoitteet.
        </h2>
        <button
          onClick={() => setIsEditingTitle(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Change Title
        </button>
      </div>
      {isEditingTitle && (
        <div className="mt-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full"
          />
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleSaveTitle}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Peruuta
            </button>
            <button
              onClick={fetchAndSetTitle}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Hae käyttäjän titteli
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoach;