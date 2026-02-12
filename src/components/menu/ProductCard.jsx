import { formatPrice } from "../../utils/helpers";
import { useCart } from "../../contexts/CartContext";
import "./ProductCard.css";
import { useEffect } from "react";
import { trackEvent } from "./../../services/trackerEvents.js";

const ProductCard = ({ product, businessSlug }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    console.log(product);
    if (window.umami) {
      umami.track("view_product", {
        productId: product.id,
        businessSlug,
      });

      umami.track("add_to_cart", {
        productId: product.id,
        businessSlug,
        price: product.price,
      });
    }
    trackEvent("view_product", {
      menuSlug: businessSlug,
      productId: product.id,
    });

    trackEvent("add_to_cart", {
      menuSlug: businessSlug,
      productId: product.id,
      price: product.price,
    });
    addItem(product, businessSlug);
  };

  if (!product.isActive || product.price === null) {
    return null;
  }

  return (
    <div className="product-card">
      {product.imageUrl && (
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
      )}

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
