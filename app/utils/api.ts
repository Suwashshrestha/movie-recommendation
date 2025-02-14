import axios, { AxiosError } from "axios";
import { json } from "@remix-run/node";

const API_BASE_URL = "http://54.172.171.231/api";
const AUTH_URL = "http://54.172.171.231/auth/token";

// Add connection status tracking
let isConnected = true;
let lastConnectionCheck = Date.now();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 second timeout
});

// Connection check function
const checkConnection = async () => {
  try {
    await api.get('/health-check');
    isConnected = true;
    console.log('API connection: OK');
  } catch (error) {
    isConnected = false;
    console.error('API connection: Failed');
  }
  lastConnectionCheck = Date.now();
};

// Request interceptor with connection handling
api.interceptors.request.use(async (config) => {
  // Check connection if last check was more than 30 seconds ago
  if (Date.now() - lastConnectionCheck > 30000) {
    await checkConnection();
  }

  if (!isConnected) {
    throw new Error('No API connection available');
  }

  if (typeof document !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
      console.log("Token attached:", token.substring(0, 10) + '...');
    }
  }
  return config;
});

// Response interceptor with error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Call Success: ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    if (error.response?.status === 401) {
      if (typeof document !== "undefined") {
        localStorage.removeItem("token");
      }
      throw new Error('Authentication failed');
    }

    if (!error.response) {
      isConnected = false;
      throw new Error('Network error - Please check your connection');
    }

    throw error;
  }
);

// Login API with error handling
export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting login...');
    const response = await axios.post(`${AUTH_URL}/login/`, { email, password });
    if (typeof document !== "undefined") {
      localStorage.setItem("token", response.data.auth_token);
    }
    console.log('Login successful');
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
      if (!error.response) {
        throw new Error('Network error - Unable to reach authentication server');
      }
    }
    throw new Error('Login failed - Please try again');
  }
};

// Logout API with error handling
export const logout = async () => {
  try {
    console.log('Attempting logout...');
    await axios.post(`${AUTH_URL}/logout/`);
    if (typeof document !== "undefined") {
      localStorage.removeItem("token");
    }
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
    if (typeof document !== "undefined") {
      localStorage.removeItem("token"); // Clear token anyway on error
    }
    throw new Error('Logout failed - Please try again');
  }
};

// Fetch Movies with error handling
export const fetchMovies = async () => {
  try {
    console.log('Fetching movies...');
    const response = await api.get("/movies/");
    console.log(`Fetched ${response.data.length} movies`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    if (!isConnected) {
      throw new Error('Unable to fetch movies - No connection to server');
    }
    throw new Error('Failed to fetch movies - Please try again');
  }
};

// Fetch Comments with error handling
export const fetchComments = async () => {
  try {
    console.log('Fetching comments...');
    const response = await api.get("/comments/");
    console.log(`Fetched ${response.data.length} comments`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    if (!isConnected) {
      throw new Error('Unable to fetch comments - No connection to server');
    }
    throw new Error('Failed to fetch comments - Please try again');
  }
};

// Export connection status checker for external use
export const checkApiConnection = checkConnection;
export const getConnectionStatus = () => isConnected;