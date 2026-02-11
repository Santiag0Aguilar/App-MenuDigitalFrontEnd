import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { parseApiError, storage } from "../utils/helpers";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(storage.get("accessToken"));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = storage.get("accessToken");

      if (storedToken) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error("Error verificando sesión:", error);
          logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    console.log(credentials);
    try {
      const response = await authAPI.login(credentials);
      const { accessToken } = response;

      storage.set("accessToken", accessToken);
      setToken(accessToken);

      const userData = await authAPI.getMe();
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.log(error.response.data);
      console.error("Error en login:", error); /* aqui */
      return {
        success: false,
        error: error.response?.data?.error || "Error al iniciar sesión",
      };
    }
  };

  const register = async (data) => {
    console.log(data);
    try {
      const response = await authAPI.register(data);

      // Auto-login después del registro
      if (response.email) {
        const loginResult = await login({
          email: data.email,
          password: data.password,
        });
        return loginResult;
      }

      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      console.log(error.response.data);
      return {
        success: false,
        error: parseApiError(error),
      };
    }
  };

  const logout = () => {
    storage.remove("accessToken");
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
