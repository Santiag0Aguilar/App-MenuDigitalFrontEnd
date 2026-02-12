import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { buildMenuUrl, applyPrimaryColor } from "../utils/helpers";

const UIContext = createContext(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI debe usarse dentro de UIProvider");
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const { user } = useAuth();

  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [templateType, setTemplateType] = useState("TEMPLATE_1");
  const [businessSlug, setBusinessSlug] = useState("");
  const [menuUrl, setMenuUrl] = useState("");

  useEffect(() => {
    if (user?.user) {
      const color = user.user.primaryColor || "#3B82F6";
      const template = user.user.templateType || "TEMPLATE_1";
      const slug = user.user.slug;
      const url = buildMenuUrl(slug);

      setPrimaryColor(color);
      setTemplateType(template);
      setBusinessSlug(slug);
      setMenuUrl(url);
      applyPrimaryColor(color);
    }
  }, [user]);

  const value = {
    primaryColor,
    templateType,
    businessSlug,
    menuUrl,
    updatePrimaryColor: setPrimaryColor,
    updateTemplateType: setTemplateType,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export default UIContext;
