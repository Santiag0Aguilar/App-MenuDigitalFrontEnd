import { useEffect, useState } from "react";
import { useParams, useLocation, NavLink } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import ProductCard from "../../components/menu/ProductCard";
import CategoryTabs from "../../components/menu/CategoryTabs";
import CartDrawer from "../../components/menu/CartDrawer";
import CheckoutForm from "../../components/menu/CheckoutForm";
import { publicMenuAPI } from "../../services/api";
import { formatPrice } from "../../utils/helpers";
import "./MenuPages.css";
import { Link } from "react-router-dom";
import { trackEvent } from "./../../services/trackerEvents.js";
import { applyPrimaryColor } from "../../utils/helpers";

export const MenuPage = () => {
  const { businessSlug } = useParams();

  const location = useLocation();
  const { getItemCount, toggleCart } = useCart();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Manejo de alerta de pedido enviado
  useEffect(() => {
    if (location.state?.orderSent) {
      setShowOrderSuccess(true);
      setTimeout(() => setShowOrderSuccess(false), 5000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /* Applay color */
  useEffect(() => {
    if (menuData?.business?.color) {
      applyPrimaryColor(menuData.business.color);
    }
  }, [menuData]);

  // Fetch del menú público por slug
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await publicMenuAPI.getMenuBySlug(businessSlug);

        setMenuData(data);
      } catch (error) {
        console.error("Error loading menu:", error);
      }
      setLoading(false);
    };

    fetchMenu();
  }, [businessSlug]);

  /* TRACKER */
  useEffect(() => {
    umami.track("view_menu", {
      businessSlug,
    });
  }, [businessSlug]);

  useEffect(() => {
    trackEvent("view_menu", {
      businessId: menuData?.business?.id,
      menuSlug: businessSlug,
    });
  }, [businessSlug]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando menú...</p>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="error-screen">
        <h2>Menú no encontrado</h2>
        <p>El menú que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  // 🔹 Adaptación al endpoint público
  const categories = Array.isArray(menuData.menu) ? menuData.menu : [];

  const filteredProducts =
    selectedCategory === "all"
      ? categories.flatMap((cat) => cat.products || [])
      : categories.find((cat) => cat.id === selectedCategory)?.products || [];

  const visibleProducts = (filteredProducts || []).filter(
    (p) => p.isActive && p.price !== null,
  );

  return (
    <div className="menu-page">
      {showOrderSuccess && (
        <div className="success-banner">
          ✅ ¡Pedido enviado! Te contactaremos pronto por WhatsApp.
        </div>
      )}

      <header className="menu-header">
        <div className="menu-header-content">
          <h1>{menuData.business?.name || "Nuestro Menú"}</h1>
          {menuData.business?.phone && (
            <a
              href={`https://wa.me/${menuData.business.phone}`}
              className="whatsapp-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬Contactar
            </a>
          )}
        </div>

        <button className="cart-button" onClick={toggleCart}>
          🛒 Carrito
          {getItemCount() > 0 && (
            <span className="cart-badge">{getItemCount()}</span>
          )}
        </button>
      </header>

      <CategoryTabs
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />

      <main className="menu-content">
        <div className="products-grid">
          {visibleProducts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <p>No hay productos disponibles en esta categoría</p>
            </div>
          ) : (
            visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                businessSlug={businessSlug}
              />
            ))
          )}
        </div>
      </main>

      <CartDrawer businessSlug={businessSlug} />
    </div>
  );
};

// ✅ CheckoutPage también protegido y usando endpoint público
export const CheckoutPage = () => {
  const { businessSlug } = useParams();
  const { items, getTotal } = useCart();
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await publicMenuAPI.getMenuBySlug(businessSlug);
        setBusinessData(data.business || null);
      } catch (error) {
        console.error("Error loading business:", error);
      }
    };

    fetchBusiness();
  }, [businessSlug]);

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-checkout">
            <span className="empty-icon">🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para continuar con tu pedido</p>
            <a href={`/menu/${businessSlug}`} className="back-btn">
              Ver Menú
            </a>
          </div>
        </div>
      </div>
    );
  }
  // menú visto

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <Link to={`/menu/${businessSlug}`} className="back-link">
            ← Volver al menú
          </Link>
          <h1>Finalizar Pedido</h1>
        </header>

        <div className="checkout-grid">
          <div className="checkout-main">
            <CheckoutForm
              businessPhone={businessData?.phone}
              businessSlug={businessSlug}
            />
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Resumen del Pedido</h3>

              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="item-quantity">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <span className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-total">
                <span>Total:</span>
                <span className="total-amount">{formatPrice(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
