import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { isValidEmail, isValidPhone } from "../../utils/helpers";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    phone: "",
    // === NUEVO ===
    loyverseKey: "",
    primaryColor: "#10B981", // default
    templateType: "TEMPLATE_1", // default
    rol: "BUSINESS", // default fijo
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMessage("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.businessName) {
      newErrors.businessName = "El nombre del negocio es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El correo es requerido";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.phone) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Teléfono inválido (10 dígitos)";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.loyverseKey) {
      newErrors.loyverseKey = "La API Key de Loyverse es requerida";
    }

    if (!formData.primaryColor) {
      newErrors.primaryColor = "El color principal es requerido";
    }

    if (!formData.templateType) {
      newErrors.templateType = "Selecciona un template";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrorMessage("");

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(result.error || "Error al registrarse");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="logo-icon">IB</div>
            <h1>InnBeta</h1>
          </div>

          <div className="auth-hero">
            <h2>Transforma tu Negocio Digital</h2>
            <p>
              Crea tu menú digital en minutos. Sincronización automática con
              Loyverse, personalización total y QR único.
            </p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <h3>Configuración Rápida</h3>
                <p>Solo necesitas tu API key de Loyverse</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <div className="feature-text">
                <h3>Sincronización Auto</h3>
                <p>Tu menú siempre actualizado</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💼</div>
              <div className="feature-text">
                <h3>Panel de Control</h3>
                <p>Gestiona todo desde un solo lugar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Crea tu cuenta</h2>
            <p>Comienza gratis hoy mismo</p>
          </div>

          {errorMessage && (
            <div className="alert alert-error">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="businessName">Nombre del Negocio</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Mi Restaurante"
                className={errors.businessName ? "input-error" : ""}
              />
              {errors.businessName && (
                <span className="error-text">{errors.businessName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono (WhatsApp)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="3001234567"
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? "input-error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="loyverseKey">Loyverse API Key</label>
              <input
                type="text"
                id="loyverseKey"
                name="loyverseKey"
                value={formData.loyverseKey}
                onChange={handleChange}
                placeholder="Tu API Key de Loyverse"
                className={errors.loyverseKey ? "input-error" : ""}
              />
              {errors.loyverseKey && (
                <span className="error-text">{errors.loyverseKey}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="templateType">Tipo de Template</label>
              <select
                id="templateType"
                name="templateType"
                value={formData.templateType}
                onChange={handleChange}
                className={errors.templateType ? "input-error" : ""}
              >
                <option value="TEMPLATE_1">Template 1 - Acordeón</option>
                <option value="TEMPLATE_2">Template 2 - Grid</option>
              </select>
              {errors.templateType && (
                <span className="error-text">{errors.templateType}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="primaryColor">Color Principal</label>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  type="text"
                  id="primaryColor"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  placeholder="#10B981"
                  className={errors.primaryColor ? "input-error" : ""}
                />
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primaryColor: e.target.value,
                    }))
                  }
                  style={{ width: "50px", height: "40px" }}
                />
              </div>
              {errors.primaryColor && (
                <span className="error-text">{errors.primaryColor}</span>
              )}
            </div>
            <input type="hidden" name="rol" value={formData.rol} />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="auth-link">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
