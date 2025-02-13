import axios from "axios";

const API_BASE_URL = "http://54.172.171.231";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  login: (data: { email: string; password: string }) => 
    api.post("/auth/token/login/", data),
  logout: () => 
    api.post("/auth/token/logout/"),
  register: (data: { username: string; email: string; password: string; re_password: string }) => 
    api.post("/auth/users/", data),
  activate: (data: { uid: string; token: string }) => 
    api.post("/auth/users/activation/", data),
  resetPassword: (data: { email: string }) => 
    api.post("/auth/users/reset_password/", data),
  resetPasswordConfirm: (data: { uid: string; token: string; new_password: string; re_new_password: string }) => 
    api.post("/auth/users/reset_password_confirm/", data),
  getCurrentUser: () => 
    api.get("/auth/users/me/"),
};

// Movies endpoints
export const movies = {
  list: () => 
    api.get("/api/movies/"),
  create: (data: any) => 
    api.post("/api/movies/", data),
  search: (query: string) => 
    api.get(`/api/movies/search/?query=${query}`),
  getById: (id: number) => 
    api.get(`/api/movies/${id}/`),
  update: (id: number, data: any) => 
    api.put(`/api/movies/${id}/`, data),
  delete: (id: number) => 
    api.delete(`/api/movies/${id}/`),
};

// Comments endpoints
export const comments = {
  list: () => 
    api.get("/api/comments/"),
  create: (data: any) => 
    api.post("/api/comments/", data),
  getById: (id: number) => 
    api.get(`/api/comments/${id}/`),
  update: (id: number, data: any) => 
    api.put(`/api/comments/${id}/`, data),
  delete: (id: number) => 
    api.delete(`/api/comments/${id}/`),
  toggleLike: (id: number) => 
    api.post(`/api/comments/${id}/toggle_like/`),
};

// Favorites endpoints
export const favorites = {
  list: () => 
    api.get("/api/favorites/"),
  create: (data: any) => 
    api.post("/api/favorites/", data),
  getById: (id: number) => 
    api.get(`/api/favorites/${id}/`),
  delete: (id: number) => 
    api.delete(`/api/favorites/${id}/`),
};

// Watchlist endpoints
export const watchlist = {
  list: () => 
    api.get("/api/watchlist/"),
  create: (data: any) => 
    api.post("/api/watchlist/", data),
  getById: (id: number) => 
    api.get(`/api/watchlist/${id}/`),
  update: (id: number, data: any) => 
    api.put(`/api/watchlist/${id}/`, data),
  delete: (id: number) => 
    api.delete(`/api/watchlist/${id}/`),
  markWatched: (id: number) => 
    api.post(`/api/watchlist/${id}/mark_watched/`),
};

// Ratings endpoints
export const ratings = {
  list: () => 
    api.get("/api/ratings/"),
  create: (data: any) => 
    api.post("/api/ratings/", data),
  getById: (id: number) => 
    api.get(`/api/ratings/${id}/`),
  update: (id: number, data: any) => 
    api.put(`/api/ratings/${id}/`, data),
  delete: (id: number) => 
    api.delete(`/api/ratings/${id}/`),
};

// Profiles endpoints
export const profiles = {
  list: () => 
    api.get("/api/profiles/"),
  create: (data: any) => 
    api.post("/api/profiles/", data),
  getById: (id: number) => 
    api.get(`/api/profiles/${id}/`),
  update: (id: number, data: any) => 
    api.put(`/api/profiles/${id}/`, data),
  delete: (id: number) => 
    api.delete(`/api/profiles/${id}/`),
};

export default api;