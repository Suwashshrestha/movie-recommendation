import axios, { AxiosError } from "axios";
import { json } from "@remix-run/node";

const API_BASE_URL = "http://54.172.171.231/api";
const AUTH_URL = "http://54.172.171.231/auth";


type RegisterData = {
  email: string;
  username: string;
  password: string;
};

let isConnected = true;
let lastConnectionCheck = Date.now();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, 
});


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


api.interceptors.request.use(async (config) => {

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
      localStorage.removeItem("token"); 
    }
    throw new Error('Logout failed - Please try again');
  }
};


export const register = async (userData: RegisterData) => {
  try {
    if (!isConnected) {
      await checkConnection();
      if (!isConnected) {
        throw new Error('No API connection available');
      }
    }

    console.log('Attempting registration...', { 
      email: userData.email, 
      username: userData.username 
    });
    
    const response = await axios.post(`${AUTH_URL}/users/`, userData);
    
    if (response.status === 201 || response.status === 200) {
      console.log('Registration successful');
      
      try {
        const loginResponse = await login(userData.email, userData.password);
        console.log('Auto-login successful after registration');
        return {
          success: true,
          user: response.data,
          auth: loginResponse
        };
      } catch (loginError) {
        console.error('Auto-login failed after registration:', loginError);
        return {
          success: true,
          user: response.data,
          auth: null,
          message: 'Registration successful but auto-login failed. Please login manually.'
        };
      }
    }

    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        const validationErrors = error.response.data;
        console.error('Validation errors:', validationErrors);
        throw new Error(JSON.stringify(validationErrors));
      }
      
      if (!error.response) {
        isConnected = false;
        throw new Error('Network error - Unable to reach registration server');
      }
      
      const status = error.response.status;
      switch (status) {
        case 409:
          throw new Error('Email or username already exists');
        case 429:
          throw new Error('Too many registration attempts. Please try again later');
        default:
          throw new Error(`Registration failed (${status}) - Please try again`);
      }
    }
    
    throw new Error('Registration failed - Please try again');
  }
};

export const checkApiConnection = checkConnection;
export const getConnectionStatus = () => isConnected;