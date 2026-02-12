import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { sendWhatsAppOrder, getCurrentLocation } from "../../utils/helpers";
import "./CheckoutForm.css";
import { trackEvent } from "./../../services/trackerEvents";

const CheckoutForm = ({ businessPhone, businessSlug }) => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    deliveryType: "pickup", // pickup | delivery | dinein
    address: "",
    references: "",
    receiverName: "",
    location: null,
    arrivalTime: "",
    paymentMethod: "cash", // cash | transfer
    hasChange: true,
    cashAmount: "",
    notes: "",
    hasTip: false,
    tip: "",
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

  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setFormData((prev) => ({ ...prev, location }));
    } catch {
      alert("No se pudo obtener la ubicación");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "El nombre es requerido";
    }

    if (formData.deliveryType === "delivery") {
      if (!formData.address.trim()) {
        newErrors.address = "La dirección es requerida";
      }
      if (!formData.receiverName.trim()) {
        newErrors.receiverName = "¿Quién recibe?";
      }
    }

    if (formData.paymentMethod === "cash" && !formData.hasChange) {
      if (!formData.cashAmount) {
        newErrors.cashAmount = "¿Con cuánto pagas?";
      }
    }
    if (formData.paymentMethod === "cash" && !formData.hasChange) {
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const tip = Number(formData.tip || 0);
      const cash = Number(formData.cashAmount || 0);

      if (cash < total + tip) {
        newErrors.cashAmount = "El monto no cubre el total + propina";
      }
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
    navigate(`/menu/${businessSlug}`, { state: { orderSent: true } });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {/* INFO */}
      <div className="form-section">
        <h3>Información Personal</h3>
        <div className="form-group">
          <label>Nombre Completo *</label>
          <input
            type="text"
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

      {/* TIPO */}
      <div className="form-section">
        <h3>Tipo de Pedido</h3>

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
                <div className="option-desc">Paso por mi pedido</div>
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
                <div className="option-desc">Lo llevan a mi casa</div>
              </div>
            </div>
          </label>

          <label
            className={`delivery-option ${formData.deliveryType === "dinein" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="deliveryType"
              value="dinein"
              checked={formData.deliveryType === "dinein"}
              onChange={handleChange}
            />
            <div className="option-content">
              <span className="option-icon">🍽️</span>
              <div>
                <div className="option-title">Comer en el lugar</div>
                <div className="option-desc">Me quedo a comer ahí</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* DOMICILIO */}
      {formData.deliveryType === "delivery" && (
        <div className="form-section">
          <h3>Datos de Entrega</h3>

          <div className="form-group">
            <label>¿Quién recibe? *</label>
            <input
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              placeholder="Nombre de quien recibe"
              className={errors.receiverName ? "input-error" : ""}
            />
            {errors.receiverName && (
              <span className="error-text">{errors.receiverName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Dirección *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle, número..."
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>

          <div className="form-group">
            <label>Referencias</label>
            <textarea
              name="references"
              value={formData.references}
              onChange={handleChange}
              placeholder="Casa azul, portón negro..."
            />
          </div>

          <button
            type="button"
            className="submit-btn"
            onClick={handleGetLocation}
          >
            📍 Enviar ubicación exacta
          </button>

          {formData.location && <small>Ubicación capturada ✔</small>}
        </div>
      )}

      {/* HORA */}
      {formData.deliveryType !== "delivery" && (
        <div className="form-section">
          <h3>Hora de llegada</h3>
          <div className="form-group">
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {/* PAGO */}
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
              <span>Pago exacto</span>
            </label>

            {!formData.hasChange && (
              <div className="form-group">
                <label>¿Con cuánto pagas?</label>
                <input
                  type="number"
                  name="cashAmount"
                  value={formData.cashAmount}
                  onChange={handleChange}
                  className={errors.cashAmount ? "input-error" : ""}
                />
                {errors.cashAmount && (
                  <span className="error-text">{errors.cashAmount}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* NOTAS */}
      <div className="form-section">
        <h3>Notas del pedido</h3>
        <div className="form-group">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Sin cebolla, extra salsa..."
          />
        </div>
      </div>

      {/* PROPINA */}
      <div className="form-section">
        <h3>Propina</h3>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="hasTip"
              checked={formData.hasTip}
              onChange={handleChange}
            />
            <span>Deseo dejar propina</span>
          </label>
        </div>

        {formData.hasTip && (
          <div className="form-group">
            <label>Monto de propina</label>
            <input
              type="number"
              name="tip"
              value={formData.tip}
              onChange={handleChange}
              placeholder="Ej: 20"
            />
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
