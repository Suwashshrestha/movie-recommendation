import axios from "axios";

const API_BASE_URL = "http://54.172.171.231";


interface OTPVerification {
  otp: string;
  email: string;
}

interface VerificationResponse {
  success: boolean;
  message: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  auth_token: string;
}

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
interface MovieResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Movie[];
}

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  rating: number;
  year: string;
  genre: string[];
}
export const fetchMovies = async (page: number = 1, pageSize: number = 12): Promise<MovieResponse> => {
  try {
    console.log(`Fetching movies page ${page} with size ${pageSize}`);

    const response = await axios.get<MovieResponse>(
      `${API_BASE_URL}/api/movies/`, {
        params: {
          page,
          page_size: pageSize
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("FetchMovies Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        console.error("API Error Response:", error.response.data);
        throw new Error(Object.values(error.response.data).flat().join(", "));
      }
      throw new Error("Network error - please try again");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const activation = async (verificationData: OTPVerification): Promise<VerificationResponse> => {
  try {
    console.log("Attempting OTP verification for:", verificationData.email);

    const response = await axios.post(
      `${API_BASE_URL}/auth/users/activation/`,
      verificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      }
    );

    console.log("OTP verification response:", response.data);
    return {
      success: true,
      message: "OTP verified successfully"
    };
  } catch (error) {
    console.error("OTP Verification Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        console.error("API Error Response:", error.response.data);
        throw new Error(Object.values(error.response.data).flat().join(", "));
      }
      throw new Error("Network error - please try again");
    }
    throw new Error("An unexpected error occurred during OTP verification");
  }
};



export const loginUser = async (credentials: LoginCredentials) => {
  try {
    console.log("Attempting login for:", credentials.email);

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/token/login/`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Login successful");
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        throw new Error(Object.values(error.response.data).flat().join(", "));
      }
      throw new Error("Network error - please try again");
    }
    throw new Error("An unexpected error occurred");
  }
};

interface UserProfile {
  email: string;
  username: string;
  is_verified: boolean;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    console.log('Fetching user profile...');
    const response = await axios.get(`${API_BASE_URL}/auth/users/me/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('User profile fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        throw new Error('Session expired. Please login again.');
      }
      if (error.response?.data) {
        throw new Error(Object.values(error.response.data).flat().join(', '));
      }
      throw new Error('Network error - please try again');
    }
    throw new Error('An unexpected error occurred');
  }
};





<<<<<<< Updated upstream
=======
  return response.json();
}

interface InteractionResponse {
  status: string;
}

export async function trackMovieInteraction(
  movieId: string,
  interactionType: 'VIEW' | 'RECOMMEND' | 'FAVORITE' | 'WATCHLIST' | 'WATCHED'
): Promise<InteractionResponse> {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await axios.get<InteractionResponse>(
      `${API_BASE_URL}/api/recommend/${movieId}/track_interaction/`,
      {
        params: {
          interaction_type: interactionType
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          'Authorization': `Token ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Movie interaction tracking error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('auth_token');
        throw new Error('Please log in to track interactions');
      }
      if (error.response?.data) {
        throw new Error(Object.values(error.response.data).flat().join(', '));
      }
      throw new Error('Network error - please try again');
    }
    throw new Error('An unexpected error occurred while tracking movie interaction');
  }
}

interface Movie {
  ems_id: string;
  title: string;
  synopsis: string;
  director: string;
  rating: string;
  original_language: string;
  movie_index: number;
  tagline: string;
  genres: Record<string, unknown>;
  cast: Record<string, unknown>;
  avg_rating: string;
}

interface MovieResponse {
  movie: Movie;
  movie_id: number;
}

interface FavoriteResponse {
  success: boolean;
  message: string;
}

export async function updateFavoriteMovie(movieId: string, movieData: Movie): Promise<FavoriteResponse> {
  const token = localStorage.getItem('auth_token');

  try {
    const response = await axios.put<FavoriteResponse>(
      `${API_BASE_URL}/api/favorites/${movieId}/`,
      movieData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          'Authorization': `Token ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to update favorite movie:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        throw new Error('Please log in to update favorites');
      }
      if (error.response?.data) {
        throw new Error(Object.values(error.response.data).flat().join(', '));
      }
      throw new Error('Network error - please try again');
    }
    throw new Error('An unexpected error occurred while updating favorite');
  }
}
type Gender = 'M' | 'F' | 'O' | 'P';
type WatchFrequency = 'DAILY' | 'WEEKLY' | 'OCCASIONALLY' | 'FEW TIMES A MONTH' | 'MONTHLY' | 'YEARLY';
type Taste = 'AWFUL' | 'MEH' | 'GOOD' | 'AMAZING' | 'HAVENT_SEEN';
export async function updateUserPreferences(
  userId: string,
  preferences: {
    age: number;
    gender: Gender;
    favoriteGenres: Record<string, unknown>;
    watchFrequency: WatchFrequency;
    taste: Taste;
  }
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('auth_token');

  try {
    const response = await axios.post(`${API_BASE_URL}/api/preferences/`,
      {
        age: preferences.age,
        gender: preferences.gender,
        favorite_genres: preferences.favoriteGenres,
        watch_frequency: preferences.watchFrequency,
        taste: preferences.taste
      },
      {
        headers: {
          "Content-Type": "application/json",
          'Accept': "application/json",
          'Authorization': `Token ${token}`,
        },
      }
    );
    
    return {
      success: true,
      message: 'Preferences updated successfully'
    };
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        throw new Error('Please log in to update preferences');
      }
      if (error.response?.data) {
        throw new Error(Object.values(error.response.data).flat().join(', '));
      }
      throw new Error('Network error - please try again');
    }
    throw new Error('An unexpected error occurred while updating preferences');
  }
}

>>>>>>> Stashed changes
