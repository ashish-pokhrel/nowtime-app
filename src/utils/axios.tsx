// utils/axios.ts
import axios from "axios";

// Set base URL for API calls if needed
const apiClient = axios.create({
  baseURL: "http://localhost:7288/api", // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch data from a given endpoint
export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
