import { createContext, useContext, useState, useEffect } from "react";
import { dashboardAPI } from "./../services/api.js";

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard fuera de provider");
  return ctx;
};

export const DashboardProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await dashboardAPI.getCategories();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===== CATEGORÍAS =====

  const createCategory = async (payload) => {
    await dashboardAPI.createCategory(payload);
    fetchCategories();
  };

  const updateCategory = async (id, payload) => {
    await dashboardAPI.updateCategory(id, payload);
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await dashboardAPI.deleteCategory(id);
    fetchCategories();
  };

  // ===== PRODUCTOS =====

  const createProduct = async (payload) => {
    await dashboardAPI.createProduct(payload);
    fetchCategories();
  };

  const updateProduct = async (id, payload) => {
    await dashboardAPI.updateProduct(id, payload);
    fetchCategories();
  };

  const deleteProduct = async (id) => {
    await dashboardAPI.deleteProduct(id);
    fetchCategories();
  };

  return (
    <DashboardContext.Provider
      value={{
        categories,
        loading,
        createCategory,
        updateCategory,
        deleteCategory,
        createProduct,
        updateProduct,
        deleteProduct,
        refresh: fetchCategories,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
