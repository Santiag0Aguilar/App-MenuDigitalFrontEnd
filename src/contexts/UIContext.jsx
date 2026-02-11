import { createContext, useContext, useState, useEffect } from 'react';
import { generateSlug, buildMenuUrl, applyPrimaryColor } from '../utils/helpers';
import { useAuth } from './AuthContext';

const UIContext = createContext(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI debe usarse dentro de UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const { user } = useAuth();
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [templateType, setTemplateType] = useState('TEMPLATE_1');
  const [businessSlug, setBusinessSlug] = useState('');
  const [menuUrl, setMenuUrl] = useState('');

  useEffect(() => {
    if (user) {
      const color = user.primaryColor || '#3B82F6';
      const template = user.templateType || 'TEMPLATE_1';
      const slug = generateSlug(user.businessName);
      const url = buildMenuUrl(slug);
      
      setPrimaryColor(color);
      setTemplateType(template);
      setBusinessSlug(slug);
      setMenuUrl(url);
      applyPrimaryColor(color);
    }
  }, [user]);

  const updatePrimaryColor = (color) => {
    setPrimaryColor(color);
    applyPrimaryColor(color);
  };

  const updateTemplateType = (template) => {
    setTemplateType(template);
  };

  const value = {
    primaryColor,
    templateType,
    businessSlug,
    menuUrl,
    updatePrimaryColor,
    updateTemplateType,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export default UIContext;
