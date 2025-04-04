import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (endpoint: string) => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/${endpoint}`);
        setData(response.data.map((item: any) => ({ ...item, selected: false })));
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        setError(`Error fetching ${endpoint}. Please try again later.`);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, setData, error };
};

export default useFetch;
