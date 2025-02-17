import axios from "axios";

const API_BASE_URL = "http://54.172.171.231";

// POST request for user registration
export const registerUser = async (userData: {
  email: string;
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/users/`, userData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        // Handle validation errors from API
        throw new Error(Object.values(error.response.data).flat().join(", "));
      } else {
        throw new Error("Network error - please try again");
      }
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// GET request to fetch movies
export const fetchMovies = async () => {
  try {
    console.log("Fetching movies from:", `${API_BASE_URL}/api/movies/`);

    const response = await axios.get(`${API_BASE_URL}/api/movies/`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("API Response:", response.data); // Debugging
    return response.data.results; 
  } catch (error) {
    console.error("FetchMovies Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        console.error("API Error Response:", error.response.data);
        throw new Error(Object.values(error.response.data).flat().join(", "));
      } else {
        throw new Error("Network error - please try again");
      }
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

