// utils/axios.ts
import axios from "axios";

// Set up the API client with base URL
const apiClient = axios.create({
  baseURL: "https://localhost:7288/api", // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch data from a given endpoint (GET)
export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error) {
  }
};

// Function to fetch details from a given endpoint with an ID (GET)
export const fetchDetail = async (endpoint: string, id: string) => {
  try {
    const response = await apiClient.get(`${endpoint}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detail from ${endpoint}?${id}:`, error);
    throw error;
  }
};

// Function to post data to a given endpoint (POST)
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

// Function to update data at a given endpoint (PUT)
export const putData = async (endpoint: string, id: string, data: any) => {
  try {
    const response = await apiClient.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error);
    throw error;
  }
};

export const postFileData = async (url: string, data: FormData) => {
  try {
    // Ensure the payload is FormData
    if (!(data instanceof FormData)) {
      throw new Error("Provided data is not a FormData instance.");
    }

    // Debug: Log FormData entries
    for (const [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Perform the POST request with the necessary headers (ensure FormData is handled properly)
    const response = await apiClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data", // Explicitly set Content-Type to multipart/form-data
      },
    });

    return response.data; // Return the data received from the server
  } catch (error) {
    console.error("Error during POST request:", error);
    throw error; // Rethrow error for handling by caller
  }
};