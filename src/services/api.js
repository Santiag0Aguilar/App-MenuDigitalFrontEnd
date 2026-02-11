import axios from "axios";

const API_BASE_URL = "https://app-menudigital.onrender.com";
const TOKEN_KEY = "accessToken";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor → mete JWT si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor → manejo global de sesión
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 - sesión inválida o expirada");
      localStorage.removeItem(TOKEN_KEY);
      // opcional: window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// -------- AUTH API --------

export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);

    // guardas token aquí
    localStorage.setItem(TOKEN_KEY, response.data.token);

    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/usuarios/me");
    return response.data;
  },
};

// -------- MENU API --------

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

// -------- PUBLIC API --------

export const publicMenuAPI = {
  getMenuBySlug: async (slug) => {
    const response = await axios.get(`${API_BASE_URL}/api/public/menu/${slug}`);

    return response.data;
  },
};

export default apiClient;
