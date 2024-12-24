import axios from "axios";
import { API_URL } from '../constant/constants';

// Set up the API client with base URL
const apiClient = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the token from localStorage or another storage method
const getAuthToken = () => {
  return localStorage.getItem("accessToken"); // You can modify this based on your app's storage method
};

// Function to add authorization header if a token exists
const setAuthHeader = () => {
  const token = getAuthToken();
  if (token) {
    apiClient.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers['Authorization']; // Remove if no token exists
  }
};

// Function to fetch data from a given endpoint (GET)
export const fetchData = async (endpoint: string) => {
  try {
    setAuthHeader(); // Set Bearer token before making the request
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Handle the error or rethrow it
  }
};

// Function to fetch details from a given endpoint with an ID (GET)
export const fetchDetail = async (endpoint: string, id: string) => {
  try {
    setAuthHeader(); // Set Bearer token before making the request
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
    setAuthHeader(); // Set Bearer token before making the request
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
    setAuthHeader(); // Set Bearer token before making the request
    const response = await apiClient.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error);
    throw error;
  }
};

// Function to post file data (POST with FormData)
export const postFileData = async (url: string, data: FormData) => {
  try {
    setAuthHeader(); // Set Bearer token before making the request

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
