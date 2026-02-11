import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/menu/ProductCard';
import CategoryTabs from '../../components/menu/CategoryTabs';
import CartDrawer from '../../components/menu/CartDrawer';
import CheckoutForm from '../../components/menu/CheckoutForm';
import { menuAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import './MenuPages.css';

export const MenuPage = () => {
  const { businessSlug } = useParams();
  const location = useLocation();
  const { getItemCount } = useCart();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.orderSent) {
      setShowOrderSuccess(true);
      setTimeout(() => setShowOrderSuccess(false), 5000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // In production, this would be a public endpoint
        const data = await menuAPI.getMenu();
        setMenuData(data);
      } catch (error) {
        console.error('Error loading menu:', error);
      }
      setLoading(false);
    };

    fetchMenu();
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

  const filteredProducts = selectedCategory === 'all' 
    ? menuData.categories?.flatMap(cat => cat.products || [])
    : menuData.categories?.find(cat => cat.id === selectedCategory)?.products || [];

  const visibleProducts = filteredProducts.filter(p => 
    p.isActive && p.price !== null
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
          <h1>{menuData.business?.businessName || 'Nuestro Menú'}</h1>
          {menuData.business?.phone && (
            <a 
              href={`https://wa.me/${menuData.business.phone}`}
              className="whatsapp-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Contactar
            </a>
          )}
        </div>
        
        <button className="cart-button" onClick={() => {}}>
          🛒 Carrito
          {getItemCount() > 0 && (
            <span className="cart-badge">{getItemCount()}</span>
          )}
        </button>
      </header>

      <CategoryTabs 
        categories={menuData.categories || []}
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
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </main>

      <CartDrawer businessSlug={businessSlug} />
    </div>
  );
};

export const CheckoutPage = () => {
  const { businessSlug } = useParams();
  const { items, getTotal } = useCart();
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await menuAPI.getMenu();
        setBusinessData(data.business);
      } catch (error) {
        console.error('Error loading business:', error);
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

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <a href={`/menu/${businessSlug}`} className="back-link">
            ← Volver al menú
          </a>
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
