import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { isValidEmail } from "../../utils/helpers";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email) {
      newErrors.email = "El correo es requerido";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrorMessage("");

    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(result.error || "Error al iniciar sesión");
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
            <h2>Menús Digitales para tu Negocio</h2>
            <p>
              Conecta tu punto de venta Loyverse y genera automáticamente tu
              menú digital con QR personalizado
            </p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <div className="feature-text">
                <h3>Menú Digital</h3>
                <p>Catálogo sincronizado en tiempo real</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <div className="feature-text">
                <h3>Personalización</h3>
                <p>Colores y templates a tu medida</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📲</div>
              <div className="feature-text">
                <h3>Código QR</h3>
                <p>Genera tu QR único para las mesas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresa a tu cuenta para continuar</p>
          </div>

          {errorMessage && (
            <div className="alert alert-error">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="auth-link">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
