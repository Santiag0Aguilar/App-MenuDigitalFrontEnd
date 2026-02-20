import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardProvider } from "./../../contexts/DashboardContext.jsx";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <DashboardProvider>
      {" "}
      {/* 👈 AQUI VA */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-icon">IB</div>
              <span>InnBeta</span>
            </div>
            <button className="sidebar-close" onClick={closeSidebar}>
              ✕
            </button>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.businessName?.charAt(0) || "U"}
            </div>
            <div className="user-info">
              <h3>{user?.businessName || "Mi Negocio"}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <NavLink
              to="/dashboard"
              end
              className="nav-item"
              onClick={closeSidebar}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/dashboard/productos"
              className="nav-item"
              onClick={closeSidebar}
            >
              <span className="nav-icon">🍽️</span>
              <span>Productos</span>
            </NavLink>

            <NavLink
              to="/dashboard/categorias"
              className="nav-item"
              onClick={closeSidebar}
            >
              <span className="nav-icon">📂</span>
              <span>Categorías</span>
            </NavLink>

            <NavLink
              to="/dashboard/configuracion-ui"
              className="nav-item"
              onClick={closeSidebar}
            >
              <span className="nav-icon">🎨</span>
              <span>Personalización</span>
            </NavLink>

            <NavLink
              to="/dashboard/qr"
              className="nav-item"
              onClick={closeSidebar}
            >
              <span className="nav-icon">📲</span>
              <span>Código QR</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span className="nav-icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="dashboard-main">
          <header className="dashboard-header">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1>Panel de Control</h1>
          </header>

          <main className="dashboard-content">
            <Outlet />{" "}
            {/* 👈 Aquí se renderizan ProductsPage y CategoriesPage */}
          </main>
        </div>

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar}></div>
        )}
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
