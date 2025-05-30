import React, {useState, useEffect } from "react";
import { fetchUserTitlesByUsername } from "./myObjectiveFunctions"; // Adjust the path if needed

interface MyCoachProps {
  user: string;
}

const MyCoach: React.FC<MyCoachProps> = ({
  user,
}) => {
    const [title, setTitle] = useState<string>(""); // State for the title
  // Fetch and update the title from backend using fetchUserTitlesByUsername
  const fetchAndSetTitle = async () => {
    if (user) {
      const titles = await fetchUserTitlesByUsername(user);
      if (titles && titles.length > 0) {
        setTitle(titles[0]); // Set the first title found
      }
    }
  };

  // Optionally, fetch the title when editing starts
  useEffect(() => {
    fetchAndSetTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between p-4 shadow mb-0 ml-4">
        <h2 className="text-xl font-bold text-gray-800">
          {title} {user} - omat tavoitteet.
        </h2>
      </div>
    </div>
  );
};

export default MyCoach;