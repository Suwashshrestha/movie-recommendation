import api from "./api";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/token/login/", { email, password });
    localStorage.setItem("auth_token", response.data.auth_token);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/users/", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/token/logout/");
    localStorage.removeItem("auth_token");
  } catch (error) {
    throw error.response?.data || "Logout failed";
  }
};
