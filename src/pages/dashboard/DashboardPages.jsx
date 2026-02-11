import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import { menuAPI } from "../../services/api";
import "./DashboardPages.css";
import QRCodeCard from "../../components/dashboard/QRCodeCard";
import { UIConfigContent } from "../../App";
import { UICustomization } from "../../components/ui/UICustomization";

// Dashboard Home
export const DashboardHome = () => {
  const { user } = useAuth();
  console.log(user);
  const { menuUrl } = useUI();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await menuAPI.getMenu();
        const totalProducts =
          data.menu?.reduce(
            (sum, cat) => sum + (cat.products?.length || 0),
            0,
          ) || 0;

        const activeProducts =
          data.menu?.reduce(
            (sum, cat) =>
              sum +
              (cat.products?.filter((p) => p.isActive && p.price !== null)
                .length || 0),
            0,
          ) || 0;

        setStats({
          totalProducts,
          activeProducts,
          totalCategories: data.menu?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Bienvenido, {user?.user.businessName}</h1>
        <p>Gestiona tu menú digital desde aquí</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Productos Totales</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeProducts}</div>
            <div className="stat-label">Productos Activos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCategories}</div>
            <div className="stat-label">Categorías</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acceso Rápido</h2>
        <div className="action-cards">
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-card"
          >
            <span className="action-icon">🌐</span>
            <div>
              <h3>Ver mi Menú</h3>
              <p>Abre tu menú público en una nueva pestaña</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

// Products Page
export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await menuAPI.getMenu();
        const allProducts =
          data.menu?.flatMap((cat) =>
            (cat.products || []).map((p) => ({
              ...p,
              categoryName: cat.name,
            })),
          ) || [];

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Productos</h1>
        <p>Gestiona tu catálogo de productos</p>
      </div>

      <div className="info-banner">
        <span>ℹ️</span>
        <p>
          Los productos se sincronizan automáticamente desde Loyverse. Solo los
          productos con precio se mostrarán en el menú público.
        </p>
      </div>

      <div className="products-table">
        {products.map((product) => (
          <div key={product.id} className="product-row">
            {product.imageUrl && (
              <div className="product-row-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
            )}
            <div className="product-row-info">
              <h3>{product.name}</h3>
              <p className="category-badge">{product.categoryName}</p>
              {product.description && (
                <p className="product-desc">{product.description}</p>
              )}
            </div>
            <div className="product-row-meta">
              <div className="product-price">
                {product.price !== null
                  ? `$${product.price.toLocaleString()}`
                  : "Sin precio"}
              </div>
              <div
                className={`product-status ${product.isActive ? "active" : "inactive"}`}
              >
                {product.isActive && product.price !== null
                  ? "Visible"
                  : "Oculto"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Categories Page
export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await menuAPI.getMenu();
        setCategories(data.menu || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Categorías</h1>
        <p>Organiza tus productos por categorías</p>
      </div>

      <div className="info-banner">
        <span>ℹ️</span>
        <p>Las categorías se sincronizan automáticamente desde Loyverse.</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div
              className="category-color"
              style={{ background: category.color || "#64748b" }}
            ></div>
            <div className="category-content">
              <h3>{category.name}</h3>
              <p>{category.products?.length || 0} productos</p>
              <div
                className={`category-status ${category.isActive ? "active" : "inactive"}`}
              >
                {category.isActive ? "Activa" : "Inactiva"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// UI Configuration Page
export const UIConfigPage = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Personalización</h1>
        <p>Personaliza la apariencia de tu menú digital</p>
      </div>

      <div className="config-grid">
        <div id="color-picker-section"></div>
        <div id="template-selector-section"></div>
      </div>
      <UICustomization />
      <br />
    </div>
  );
};

// QR Page
export const QRPage = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Código QR</h1>
        <p>Descarga e imprime tu código QR para las mesas</p>
      </div>

      <div id="qr-code-section"></div>
      <QRCodeCard />
    </div>
  );
};
