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
    // alert("Data being sent to the server: " + JSON.stringify(updateData));
    // Make a PATCH request to update the given user's data
    const response = await axios.patch(
      `http://localhost:5000/api/myobjectives/${username}`,
      updateData
    );
    if (response.status === 200) {
      console.log("MyObjectiveData successfully updated:", response.data);
      return true; // Indicate success
    }
    return false; // Indicate failure if status is not 200
  } catch (error) {
    console.error("Error patching MyObjectiveData:", error);
    return false; // Indicate failure
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
