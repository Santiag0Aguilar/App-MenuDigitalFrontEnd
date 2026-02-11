import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UIProvider } from "./contexts/UIContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import {
  DashboardHome,
  ProductsPage,
  CategoriesPage,
  UIConfigPage,
  QRPage,
} from "./pages/dashboard/DashboardPages";
import { MenuPage, CheckoutPage } from "./pages/menu/MenuPages";
import { ColorPicker, TemplateSelector } from "./components/ui/UICustomization";
import QRCodeCard from "./components/dashboard/QRCodeCard";
import { createPortal } from "react-dom";
import { useEffect } from "react";

// Portal components for dashboard pages
const UIConfigContent = () => {
  useEffect(() => {
    const colorSection = document.getElementById("color-picker-section");
    const templateSection = document.getElementById(
      "template-selector-section",
    );

    return () => {
      if (colorSection) colorSection.innerHTML = "";
      if (templateSection) templateSection.innerHTML = "";
    };
  }, []);

  const colorSection = document.getElementById("color-picker-section");
  const templateSection = document.getElementById("template-selector-section");

  return (
    <>
      {colorSection && createPortal(<ColorPicker />, colorSection)}
      {templateSection && createPortal(<TemplateSelector />, templateSection)}
    </>
  );
};

const QRPageContent = () => {
  useEffect(() => {
    const qrSection = document.getElementById("qr-code-section");
    return () => {
      if (qrSection) qrSection.innerHTML = "";
    };
  }, []);

  const qrSection = document.getElementById("qr-code-section");
  return qrSection && createPortal(<QRCodeCard />, qrSection);
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Menu Routes */}
              <Route path="/menu/:businessSlug" element={<MenuPage />} />
              <Route
                path="/menu/:businessSlug/checkout"
                element={<CheckoutPage />}
              />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="productos" element={<ProductsPage />} />
                <Route path="categorias" element={<CategoriesPage />} />
                <Route
                  path="configuracion-ui"
                  element={
                    <>
                      <UIConfigPage />
                      <UIConfigContent />
                    </>
                  }
                />
                <Route
                  path="qr"
                  element={
                    <>
                      <QRPage />
                      <QRPageContent />
                    </>
                  }
                />
              </Route>

              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </CartProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
