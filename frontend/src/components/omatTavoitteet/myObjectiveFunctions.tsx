import axios from "axios";
import { MyObjectivesJson } from "../../types/types"; // Adjust the path if necessary

// Fetch data from the backend
export const fetchMyObjectiveData = async (
  username: string
): Promise<MyObjectivesJson | null> => {
  try {
    // Make a GET request with the username as a query parameter
    const response = await axios.get(
      `http://localhost:5000/api/myobjectives?user=${username}`
    );
    if (response.data) {
      return response.data; // Return the fetched data
    }
    return null; // Return null if no data is found
  } catch (error) {
    console.error("Error fetching MyObjectiveData:", error);
    return null;
  }
};

export const patchMyObjectiveData = async (
  username: string,
  updateData: Partial<MyObjectivesJson>
): Promise<boolean> => {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    // Ensure every objective has a non-empty seuranta field
    if (
      updateData.objectives &&
      Array.isArray(updateData.objectives) &&
      updateData.objectives.some(obj => !obj.seuranta)
    ) {
      console.error("All objectives must have a non-empty seuranta field.");
      return false;
    }

    const response = await axios.patch(
      `${API_BASE_URL}/api/myobjectives/${username}`,
      updateData
    );
    if (response.status === 200) {
      console.log("MyObjectiveData successfully updated:", response.data);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error patching MyObjectiveData:", error);
    return false;
  }
};

// Post updated data to the backend
export const postMyObjectiveData = async (
  data: MyObjectivesJson
): Promise<boolean> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/myobjectives",
      data
    );
    if (response.status === 200) {
      console.log("MyObjectiveData successfully updated:", response.data);
      return true; // Indicate success
    }
    return false; // Indicate failure if status is not 200
  } catch (error) {
    console.error("Error posting MyObjectiveData:", error);
    return false; // Indicate failure
  }
};

/**
 * Fetches the user list and filters titles based on the given username.
 * @param username The username to filter titles for.
 * @returns An array of titles belonging to the user, or an empty array if not found.
 */
export const fetchUserTitlesByUsername = async (
  username: string
): Promise<string[]> => {
  try {
    const response = await axios.get("http://localhost:5000/api/userlist");
    if (response.data && Array.isArray(response.data)) {
      // Find the user by username and return their titles
      const user = response.data.find((user: any) => user.username === username);
      if (user && Array.isArray(user.titles)) {
        return user.titles;
      }
      // If only a single title per user
      if (user && typeof user.title === "string") {
        return [user.title];
      }
      return [];
    }
      return [];
    } catch (error) {
      console.error("Error fetching user list:", error);
      return [];
    }
  };