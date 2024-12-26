import axios from "axios";
import { API_URL } from '../constant/constants';
import {EXPIRE_MINUTES, accessTokenLocalStorage, userGuidLocalStorage, profileImageLocalStorage, tokenExpiresInLocalStorage} from "../constant/constants";


// Set up the API client with base URL
const apiClient = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});


const getAuthToken = () => {
  return sessionStorage.getItem("accessToken"); 
};

const setAuthHeader = (newToken? : any) => {
  const token = newToken ?? getAuthToken();
  if (token) {
    apiClient.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers['Authorization']; 
  }
};

const handleError = (error: any) => {
  if(error.status == 401)
  {
    sessionStorage.removeItem(accessTokenLocalStorage);
    sessionStorage.removeItem(userGuidLocalStorage);
    sessionStorage.removeItem(profileImageLocalStorage);
    sessionStorage.removeItem(tokenExpiresInLocalStorage);
    window.location.href = "/user/signIn";
  }
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || "Something went wrong";
    throw new Error(message);
  } else {
    throw new Error("Unexpected error occurred");
  }
};

// Function to fetch data from a given endpoint (GET)
export const fetchData = async (endpoint: string) => {
  try {
    setAuthHeader();
    const response = await apiClient.get(endpoint);
    if (response.status === 200) {
      return response;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    handleError(error);
  }
};

export const refreshTokenAndRetry = async () => {
  try {
  const refreshToken = sessionStorage.getItem("userGuid");
  const response = await apiClient.get(`/user/refreshToken?refreshToken=${refreshToken}`);
  if (response.status === 200) {
    sessionStorage.clear();
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getSeconds() + EXPIRE_MINUTES);
    sessionStorage.setItem(tokenExpiresInLocalStorage, currentDateTime.toISOString());
    const { jwtToken, refreshToken, profileImage } = response.data.user;
    sessionStorage.setItem(accessTokenLocalStorage, jwtToken);
    sessionStorage.setItem(userGuidLocalStorage, refreshToken);
    sessionStorage.setItem(profileImageLocalStorage, profileImage);
    return response;
    }
  }
  catch (error) {
    handleError(error);
  }
};

// Function to fetch details from a given endpoint with an ID (GET)
export const fetchDetail = async (endpoint: string, id: string) => {
  try {
    setAuthHeader();
    const response = await apiClient.get(`${endpoint}${id}`);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    handleError(error);
  }
};

// Function to post data to a given endpoint (POST)
export const postData = async (endpoint: string, data: any) => {
  try {
    setAuthHeader();
    const response = await apiClient.post(endpoint, data);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    handleError(error);
  }
};

// Function to update data at a given endpoint (PUT)
export const putData = async (endpoint: string, id: string, data: any) => {
  try {
    setAuthHeader();
    const response = await apiClient.put(`${endpoint}/${id}`, data);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    handleError(error);
  }
};

// Function to post file data (POST with FormData)
export const postFileData = async (url: string, data: FormData) => {
  try {
    setAuthHeader();
    if (!(data instanceof FormData)) {
      throw new Error("Provided data is not a FormData instance.");
    }
    const response = await apiClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    handleError(error);
  }
};
