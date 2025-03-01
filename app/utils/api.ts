import axios from "axios";

const API_BASE_URL = "https://d2448fnikplodi.cloudfront.net";

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

const handleError = (error: unknown) => {
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
};

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
    handleError(error);
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
  posterUri?: string;
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
    handleError(error);
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
    handleError(error);
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
    handleError(error);
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
      headers: getAuthHeaders(),
    });

    console.log('User profile fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    handleError(error);
  }
};

interface InteractionResponse {
  status: string;
}

export async function trackMovieInteraction(
  movieId: string,
  interactionType: 'VIEW' | 'RECOMMEND' | 'FAVORITE' | 'WATCHLIST' | 'WATCHED'
): Promise<InteractionResponse> {

  try {
    const response = await axios.get<InteractionResponse>(
      `${API_BASE_URL}/api/recommend/${movieId}/track_interaction/`,
      {
        params: {
          interaction_type: interactionType
        },
        headers: localStorage.getItem('auth_token') ? getAuthHeaders() : {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Movie interaction tracking error:', error);
    handleError(error);
  }
}

export interface MovieSearch {
  id: string;
  movie_index: number;
  ems_id: string;
  title: string;
  synopsis?: string;
  director?: string;
  producer?: string;
  screenwriter?: string;
  distributor?: string;
  rating?: string;
  original_language?: string;
  overview?: string;
  tagline?: string;
  genres: string[];
  production_companies: string[];
  production_countries: string[];
  spoken_languages: string[];
  cast: string[];
  director_of_photography?: string;
  writers?: string[];
  producers?: string[];
  music_composer?: string;
  avg_rating?: number;
  posterUri?: string;
  audienceScore?: {
    score: number;
    count: number;
  };
  criticsScore?: {
    score: number;
    count: number;
  };
  mediaUrl?: string;
  popularity_score?: number;
  total_interactions?: number;
  weekly_views?: number;
  last_interaction?: string;
  created_at: string;
  updated_at: string;
}

interface SearchResponse {
  results: MovieSearch[];
  count: number;
  next: string | null;
  previous: string | null;
}

export async function searchMovies(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
     
      
  });

  const response = await fetch(
      `${API_BASE_URL}/api/movies/search/?search=${params.toString()}` 
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}

export async function getMovieById(id: string): Promise<MovieSearch> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
}

export async function getRecommendedMovies(movieIndex: number): Promise<MovieSearch[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/recommend/get_recommendations_by_movie_idx/?page=1&page_size=10&movie_index=${movieIndex}&limit=5`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recommended movies");
  }

  return response.json();
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
  try {
    const response = await axios.put<FavoriteResponse>(
      `${API_BASE_URL}/api/favorites/${movieId}/`,
      movieData,
      {
        headers: getAuthHeaders(),
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to update favorite movie:', error);
    handleError(error);
  }
}

type Gender = 'M' | 'F' | 'O' | 'P';
type WatchFrequency = 'DAILY' | 'WEEKLY' | 'OCCASIONALLY' | 'FEW TIMES A MONTH' | 'MONTHLY' | 'YEARLY';

export async function updateUserPreferences(
  userId: string,
  preferences: {
    age: number;
    gender: Gender;
    favoriteGenres: Record<string, unknown>;
    watchFrequency: WatchFrequency;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/preferences/`,
      {
        age: preferences.age,
        gender: preferences.gender,
        favorite_genres: preferences.favoriteGenres,
        watch_frequency: preferences.watchFrequency,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("preferences", response.data);
    
    return {
      success: true,
      message: 'Preferences updated successfully'
    };
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    handleError(error);
  }
}

export async function getUserPreferences(): Promise<{ alreadyExists: boolean;} > {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/preferences/`, {
      headers: getAuthHeaders(),
    });
    
    console.log("preferences", response.data);
    return {
      alreadyExists: response.data.age ? true : false,
    };
  } catch (error) {
    console.error('Failed to fetch user preferences:', error);
    handleError(error);
  }
}

export interface MovieTrending {
  id: string;
  ems_id: string;
  title: string;
  synopsis?: string;
  director?: string;
  producer?: string;
  screenwriter?: string;
  distributor?: string;
  rating?: string;
  original_language?: string;
  movie_index?: string;
  overview?: string;
  tagline?: string;
  genres?: { [key: string]: string };
  production_companies?: { [key: string]: string };
  production_countries?: { [key: string]: string };
  spoken_languages?: { [key: string]: string };
  cast?: { [key: string]: string };
  director_of_photography?: string;
  writers?: string[];
  producers?: string[];
  music_composer?: string;
  avg_rating?: number;
  posterUri?: string;
  audienceScore?: { [key: string]: number };
  criticsScore?: { [key: string]: number };
  mediaUrl?: string;
  updated_at?: string;
  created_at?: string;
  popularity_score?: number;
  total_interactions?: number;
  weekly_views?: number;
  last_interaction?: string;
  search_vector?: string;
}

export interface TrendingMoviesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MovieTrending[];
}

export async function getTrendingMovies(): Promise<TrendingMoviesResponse> {
  try {
    const response = await axios.get<TrendingMoviesResponse>(
      `${API_BASE_URL}/api/movies/trending/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    handleError(error);
  }
}
type taste = 'AWFUL' | 'MEH' | 'GOOD' | 'AMAZING' | 'HAVENT SEEN'

export async function updateUserMoviePreferences(
  userId: string,
  preferences: {
    movie : number;
    taste: taste;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/movie-taste/`,
      {
        movie: preferences.movie, // Include userId if required by the API
        taste: preferences.taste, // Ensure this matches the backend's expected structure
      },
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      message: 'Preferences updated successfully',
    };
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    handleError(error); // Ensure this function is defined and handles errors properly

    // Return a consistent error response
    return {
      success: false,
      message: 'Failed to update preferences',
    };
  }
}

interface RatingMovie {
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

interface RatingRequest {
  movie: RatingMovie;
  movie_id: number;
  score: number;
}

interface RatingResponse {
  success: boolean;
  message: string;
}

export async function 
submitMovieRating(ratingData: RatingRequest): Promise<RatingResponse> {
  try {
    const response = await axios.post<RatingResponse>(
      `${API_BASE_URL}/api/ratings/`,
      ratingData,
      {
        headers: getAuthHeaders(),
      }
    );
    
    return {
      success: true,
      message: 'Rating submitted successfully'
    };
  } catch (error) {
    console.error('Failed to submit rating:', error);
    handleError(error);
  }
}

interface UserRating {
  id: number;
  movie: Movie;
  score: number;
  created_at: string;
  updated_at: string;
}

interface UserRatingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserRating[];
}

export async function getUserRatings(): Promise<UserRatingsResponse> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get<UserRatingsResponse>(
      `${API_BASE_URL}/api/ratings/`,
      {
        headers: getAuthHeaders(),
      }
    );
                    
  
    const movieIds = response.data.results.map((movie) => movie.movie.id);
    return response.data;
   
  } catch (error) {
    console.error('Failed to fetch user ratings:', error);
    handleError(error);
  }
}
  export async function getUserRatingsIds(): Promise<{score:number,movie:number}> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get<UserRatingsResponse>(
      `${API_BASE_URL}/api/ratings/`,
      {
        headers: getAuthHeaders(),
      }
    );
                    
  
        const movieIds = response.data.results.map((movie) => movie.movie.id);
        const scores = response.data.results.map((movie) => movie.score);
        return {movie:movieIds,score:scores};
   
  } catch (error) {
    console.error('Failed to fetch user ratings:', error);
    handleError(error);
  }
}




interface CreateFavoriteResponse {
  success: boolean;
  message: string;
}

export async function createFavoriteMovie(movieData: number): Promise<CreateFavoriteResponse> {
  try {
    const response = await axios.post<CreateFavoriteResponse>(
      `${API_BASE_URL}/api/favorites/`,
      {
        "movie_id": movieData
      },
      {
        headers: getAuthHeaders(),
      }
    );

    await fetchAndCacheFavorites();
    
    return response.data;
   
  } catch (error) {
    console.error('Failed to add favorite movie:', error);
    handleError(error);
  }
}
interface FavoriteMoviesCache {
  movie: {movieIds:number, userFavoriteId:number}[];
  lastFetched: number;
}
let favoriteMoviesCache: FavoriteMoviesCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function fetchAndCacheFavorites(): Promise<number[]> {
  const response = await axios.get<any>(
    `${API_BASE_URL}/api/favorites/`,
    {
      headers: getAuthHeaders(),
    }
  );
  
  const movie = response.data.results.map((movie) => ({ movieIds: movie.movie.id, userFavoriteId: movie.id }));
  console.log("movie", movie);
  favoriteMoviesCache = {
    movie,
    lastFetched: Date.now()
  };
  return movie;
}

export async function getFavoriteMovie(movieData: number): Promise<{isFavorite: boolean}> {

  try {
        // Check if cache exists and is still valid
        if (!favoriteMoviesCache || Date.now() - favoriteMoviesCache.lastFetched > CACHE_DURATION) {
          await fetchAndCacheFavorites();
        }

        // Ensure favoriteMoviesCache is not null before accessing
        if (!favoriteMoviesCache) {
          return { isFavorite: false };
        }

        return { isFavorite: favoriteMoviesCache.movie.some(m => m.movieIds === movieData) };
      } catch (error) {
        console.error('Failed to check favorite movie:', error);
        handleError(error);
      }
}

export async function deleteFavoriteMovie(movieData: number): Promise<CreateFavoriteResponse> {
  try {
    if (!favoriteMoviesCache || Date.now() - favoriteMoviesCache.lastFetched > CACHE_DURATION) {
      console.log("fetching and caching favorites");
      await fetchAndCacheFavorites();
    }
    if (!favoriteMoviesCache) {
      console.log("No favorite movies cache");
      return { success: false, message: 'Failed to delete favorite movie' };
    }
    const userFavoriteId = favoriteMoviesCache.movie.find(m => m.movieIds === movieData)?.userFavoriteId;
    console.log("movieData", favoriteMoviesCache.movie.find(m => m.movieIds === movieData));
    if (!userFavoriteId) {
      console.log("No user favorite id");
      return { success: false, message: 'Failed to delete favorite movie' };
    }

    const response = await axios.delete<CreateFavoriteResponse>(
      `${API_BASE_URL}/api/favorites/${userFavoriteId}/`,
      {
        headers: getAuthHeaders(),
      }
    );
    
    await fetchAndCacheFavorites();
    return response.data;
  } catch (error) {
    console.error('Failed to delete favorite movie:', error);
    handleError(error);
  }
}


export async function createWatchListMovie(movieData: number): Promise<CreateFavoriteResponse> {
  try {
    const response = await axios.post<CreateFavoriteResponse>(
      `${API_BASE_URL}/api/watchlist/`,
      {
        "movie_id": movieData
      },
      {
        headers: getAuthHeaders(),
      }
    );
    
    await fetchAndCacheWatchList();
    return response.data;

  } catch (error) {
    console.error('Failed to add watchlist movie:', error);
    handleError(error);
  }
}

// Cache variables
let watchListMoviesCache: FavoriteMoviesCache | null = null;
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function fetchAndCacheWatchList(): Promise<number[]> {
  const response = await axios.get<any>(
    `${API_BASE_URL}/api/watchlist/`,
    {
      headers: getAuthHeaders(),
    }
  );
  
  const movie = response.data.results.map((movie) => ({ movieIds: movie.movie.id, userFavoriteId: movie.id }));
  watchListMoviesCache = {
    movie,
    lastFetched: Date.now()
  };
  return movie;
}

export async function getWatchListMovie(movieData: number): Promise<{isWatchListed: boolean}> {

  try {
        // Check if cache exists and is still valid
        if (!watchListMoviesCache || Date.now() - watchListMoviesCache.lastFetched > CACHE_DURATION) {
          await fetchAndCacheWatchList();
        }

        // Ensure watchListMoviesCache is not null before accessing
        if (!watchListMoviesCache) {
          return { isWatchListed: false };
        }

        return { isWatchListed: watchListMoviesCache.movie.some(m => m.movieIds === movieData) };
      } catch (error) {
        console.error('Failed to check watchlist movie:', error);
        handleError(error);
      }
}

export async function deleteWatchListMovie(movieData: number): Promise<CreateFavoriteResponse> {
  try {
    if (!watchListMoviesCache || Date.now() - watchListMoviesCache.lastFetched > CACHE_DURATION) {
      await fetchAndCacheWatchList();
    }
    if (!watchListMoviesCache) {
      return { success: false, message: 'Failed to delete watchlist movie' };
    }
    const userFavoriteId = watchListMoviesCache.movie.find(m => m.movieIds === movieData)?.userFavoriteId;
    if (!userFavoriteId) {
      return { success: false, message: 'Failed to delete watchlist movie' };
    }

    const response = await axios.delete<CreateFavoriteResponse>(
      `${API_BASE_URL}/api/watchlist/${userFavoriteId}/`,
      {
        headers: getAuthHeaders(),
      }
    );
    await fetchAndCacheWatchList();
    return response.data;
  } catch (error) {
    console.error('Failed to delete watchlist movie:', error);
    handleError(error);
  }
}
