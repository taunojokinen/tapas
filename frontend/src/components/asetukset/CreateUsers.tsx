import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios"; // Import axios

const CreateUsers: React.FC = () => {
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [showJson, setShowJson] = useState<boolean>(true); // Toggle to show JSON or success message
    const [showFetchedList, setShowFetchedList] = useState<boolean>(true); // Toggle fetched list visibility
    const [message, setMessage] = useState<string>("");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        Papa.parse(file, {
          header: true, // Treat the first row as headers
          skipEmptyLines: true, // Skip empty lines
          complete: (result) => {
            setJsonData(result.data); // Set the parsed JSON data
            console.log("Parsed JSON:", result.data); // Log the JSON data
            setMessage("File loaded successfully!"); // Set success message
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setMessage("Error loading file.");
          },
        });
      }
    };

    const removeDuplicates = (list: any[]) => {
        const seen = new Set();
        return list.filter((item) => {
          const duplicate = seen.has(item.username); // Check if the username is already in the Set
          seen.add(item.username); // Add the username to the Set
          return !duplicate; // Keep only unique rows
        });
      };

    const saveToDatabase = async () => {

        if (!jsonData || jsonData.length === 0) {
            setMessage("Error: No data to save. Please upload a valid file.");
            console.error("Error: No data to save.");
            return; // Exit the function early
          }
        console.log("Saving data to MongoDB:", jsonData); // Log the data being sent
        const uniqueData = removeDuplicates(jsonData);
        deleteUserList(); // Clear the user list before saving new data
        try {
            const response = await axios.post(`${apiUrl}/api/userlist`, uniqueData, {

                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Data being sent to API:",response.status);
            if (response.status === 200|| response.status === 201) {
                setMessage("Data saved to MongoDB successfully!");
                console.log("Data saved successfully!");
            } else {
                setMessage("Failed to save data to MongoDB.");
                console.error("Failed to save data:", response.data);
            }
        } catch (error) {
            console.error("Error saving data to MongoDB:", error);
            setMessage("Frontend: An error occurred while saving data.");
        }
    };

    const [userList, setUserList] = useState<any[]>([]); // State to store the user list

const fetchUserList = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/userlist`);
        const fetchedData = response.data;

        if (!fetchedData || fetchedData.length === 0) {
          setMessage("No users found in the database.");
          console.log("No users found in the database.");
          setUserList([]); // Clear the user list in the state
          return; // Exit the function early
        }
        
        setUserList(response.data); // Store the fetched user list in state
        console.log("Fetched user list:", response.data);
    } catch (error) {
        console.error("Error fetching user list:", error);
        setMessage("Error fetching user list.");
    }
};

const deleteUserList = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/api/userlist`);
      if (response.status === 200) {
        setMessage("User list deleted successfully!");
        console.log("User list deleted successfully!");
        setUserList([]); // Clear the user list from the state
      } else {
        setMessage("Failed to delete user list.");
        console.error("Failed to delete user list:", response.data);
      }
    } catch (error) {
      console.error("Error deleting user list:", error);
      setMessage("Frontend: An error occurred while deleting the user list.");
    }
  };

return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Users</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />
      <div className="flex items-center mb-4">
        <label htmlFor="toggleJson" className="mr-2">
          Show JSON Data
        </label>
        <input
          type="checkbox"
          id="toggleJson"
          checked={showJson}
          onChange={() => setShowJson(!showJson)}
        />
      </div>
      {showJson ? (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      ) : (
        <p className="text-green-500">{message}</p>
      )}
      <button
        onClick={saveToDatabase}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save to Database
      </button>
      <button
        onClick={fetchUserList}
        className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Fetch User List
      </button>
      <button
        onClick={deleteUserList}
        className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete User List
      </button>
            {/* Toggle Fetched User List */}
            <div className="flex items-center mt-6">
        <label htmlFor="toggleFetchedList" className="mr-2">
          Show Fetched User List
        </label>
        <input
          type="checkbox"
          id="toggleFetchedList"
          checked={showFetchedList}
          onChange={() => setShowFetchedList(!showFetchedList)}
        />
      </div>
  
      {/* Fetched User List */}
      {showFetchedList && (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Fetched User List</h2>
        {userList.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">username</th>
                <th className="border border-gray-300 px-4 py-2">firstname</th>
                <th className="border border-gray-300 px-4 py-2">lastname</th>
                <th className="border border-gray-300 px-4 py-2">title</th>
                <th className="border border-gray-300 px-4 py-2">supervisor</th>
                <th className="border border-gray-300 px-4 py-2">role</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.firstName}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.lastName}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.supervisor}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
        )}
    </div>
  );
  
};




export default CreateUsers;