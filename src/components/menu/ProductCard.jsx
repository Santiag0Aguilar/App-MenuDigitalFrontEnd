import { formatPrice } from "../../utils/helpers";
import { useCart } from "../../contexts/CartContext";
import "./ProductCard.css";
import { useEffect } from "react";

const ProductCard = ({ product, businessSlug }) => {
  const { addItem } = useCart();

  useEffect(() => {
    umami.track("view_product", {
      productId: product.id,
      businessSlug,
    });
  }, [product.id, businessSlug]);

  const handleAddToCart = () => {
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
