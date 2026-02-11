import axios from "axios";

const API_BASE_URL = "https://app-menudigital.onrender.com";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 - sesión inválida");
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  login: async (credentials) => {
    console.log(credentials);
    const response = await apiClient.post(
      "/auth/login",
      credentials,
    ); /* Aqui */
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/usuarios/me");
    return response.data;
  },
};

// Menu API
export const menuAPI = {
  getMenu: async () => {
    const response = await apiClient.get("/menu/");
    return response.data;
  },

  updateMenu: async (data) => {
    const response = await apiClient.post("/menu/update", data);
    return response.data;
  },
};

// Public Menu API (no auth required)
export const publicMenuAPI = {
  getMenuBySlug: async (slug) => {
    // This would need to be implemented on the backend
    // For now, we'll use the authenticated endpoint
    const response = await axios.get(`${API_BASE_URL}/menu/public/${slug}`);
    return response.data;
  },
};

export default apiClient;
