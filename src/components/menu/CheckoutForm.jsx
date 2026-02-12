import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { sendWhatsAppOrder } from "../../utils/helpers";
import "./CheckoutForm.css";
import { trackEvent } from "./../../services/trackerEvents";

const CheckoutForm = ({ businessPhone, businessSlug }) => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: "",
    deliveryType: "pickup",
    address: "",
    paymentMethod: "cash",
    hasChange: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "El nombre es requerido";
    }

    if (formData.deliveryType === "delivery" && !formData.address.trim()) {
      newErrors.address = "La dirección es requerida para domicilio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const order = {
      items,
      ...formData,
    };

    if (window.umami) {
      umami.track("checkout_submit", {
        businessSlug,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemsCount: items.length,
      });
    }
    trackEvent("checkout_submit", {
      menuSlug: businessSlug,
      price: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    });
    sendWhatsAppOrder(businessPhone, order);
    clearCart();
    navigate(`/menu/${businessSlug}`, {
      state: { orderSent: true },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-section">
        <h3>Información Personal</h3>

        <div className="form-group">
          <label htmlFor="customerName">Nombre Completo *</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Tu nombre"
            className={errors.customerName ? "input-error" : ""}
          />
          {errors.customerName && (
            <span className="error-text">{errors.customerName}</span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Tipo de Entrega</h3>

        <div className="delivery-options">
          <label
            className={`delivery-option ${formData.deliveryType === "pickup" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={formData.deliveryType === "pickup"}
              onChange={handleChange}
            />
            <div className="option-content">
              <span className="option-icon">🏪</span>
              <div>
                <div className="option-title">Recoger en Local</div>
                <div className="option-desc">Pasa por tu pedido</div>
              </div>
            </div>
          </label>

          <label
            className={`delivery-option ${formData.deliveryType === "delivery" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="deliveryType"
              value="delivery"
              checked={formData.deliveryType === "delivery"}
              onChange={handleChange}
            />
            <div className="option-content">
              <span className="option-icon">🛵</span>
              <div>
                <div className="option-title">Domicilio</div>
                <div className="option-desc">Lo llevamos a tu casa</div>
              </div>
            </div>
          </label>
        </div>

        {formData.deliveryType === "delivery" && (
          <div className="form-group">
            <label htmlFor="address">Dirección de Entrega *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle, número, referencias..."
              rows="3"
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>
        )}
      </div>

      <div className="form-section">
        <h3>Método de Pago</h3>

        <div className="payment-options">
          <label
            className={`payment-option ${formData.paymentMethod === "cash" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === "cash"}
              onChange={handleChange}
            />
            <div className="option-content">
              <span className="option-icon">💵</span>
              <span className="option-title">Efectivo</span>
            </div>
          </label>

          <label
            className={`payment-option ${formData.paymentMethod === "card" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={handleChange}
            />
            <div className="option-content">
              <span className="option-icon">💳</span>
              <span className="option-title">Tarjeta</span>
            </div>
          </label>

          <label
            className={`payment-option ${formData.paymentMethod === "transfer" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="transfer"
              checked={formData.paymentMethod === "transfer"}
              onChange={handleChange}
            />
            <div className="option-content">
              <span className="option-icon">📱</span>
              <span className="option-title">Transferencia</span>
            </div>
          </label>
        </div>

        {formData.paymentMethod === "cash" && (
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="hasChange"
                checked={formData.hasChange}
                onChange={handleChange}
              />
              <span>Tengo cambio exacto</span>
            </label>
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn">
        Enviar Pedido por WhatsApp
      </button>
    </form>
  );
};

export default CheckoutForm;
