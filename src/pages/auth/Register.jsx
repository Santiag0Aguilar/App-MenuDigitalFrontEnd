import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { isValidEmail, isValidPhone } from "../../utils/helpers";
import "./Auth.css";
import ThunderSvg from "../../assets/thunder-svgrepo-com.png";
import RefreshSvg from "../../assets/refresh-cw-alt-svgrepo-com.png";
import BriefCaseSvg from "../../assets/briefcase-svgrepo-com.png";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    phone: "",
    loyverseKey: "",
    primaryColor: "#10B981",
    templateType: "TEMPLATE_1",
    rol: "BUSINESS",
    source: "INTERNAL",
  });

  const inputRefs = {
    businessName: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    loyverseKey: useRef(null),
    templateType: useRef(null),
    primaryColor: useRef(null),
  };
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [step, setStep] = useState(1);
  const totalSteps = 4;

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

    if (formData.source === "LOYVERSE" && !formData.loyverseKey) {
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

    const { confirmPassword, loyverseKey, ...baseData } = formData;

    let registerData;

    if (formData.source === "LOYVERSE") {
      registerData = {
        ...baseData,
        loyverseKey,
        source: "LOYVERSE",
      };
    } else {
      registerData = {
        ...baseData,
        source: "INTERNAL",
      };
    }

    const result = await register(registerData);

    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(result.error || "Error al registrarse");
    }
  };
  const scrollToFirstError = (errorsObj) => {
    const firstErrorKey = Object.keys(errorsObj)[0];
    if (!firstErrorKey) return;

    const ref = inputRefs[firstErrorKey];

    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      ref.current.focus();
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.businessName) {
        newErrors.businessName = "El nombre del negocio es requerido";
      }

      if (!formData.phone) {
        newErrors.phone = "El teléfono es requerido";
      } else if (!isValidPhone(formData.phone)) {
        newErrors.phone = "Teléfono inválido (10 dígitos)";
      }
    }

    if (step === 2) {
      if (!formData.email) {
        newErrors.email = "El correo es requerido";
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = "Correo inválido";
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
    }

    if (step === 3) {
      if (formData.source === "LOYVERSE" && !formData.loyverseKey) {
        newErrors.loyverseKey = "La API Key de Loyverse es requerida";
      }
    }

    if (step === 4) {
      if (!formData.templateType) {
        newErrors.templateType = "Selecciona un template";
      }

      if (!formData.primaryColor) {
        newErrors.primaryColor = "El color principal es requerido";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
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
              <div className="feature-icon">
                <img
                  className="feature-icon__image"
                  src={ThunderSvg}
                  alt="Thunder Icon"
                />
              </div>
              <div className="feature-text">
                <h3>Configuración Rápida</h3>
                <p>Solo necesitas elegir como crear tu menu</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                {" "}
                <img
                  className="feature-icon__image"
                  src={RefreshSvg}
                  alt="Refresh Icon"
                />
              </div>
              <div className="feature-text">
                <h3>Sincronización Auto</h3>
                <p>Tu menú siempre actualizado</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                {" "}
                <img
                  className="feature-icon__image"
                  src={BriefCaseSvg}
                  alt="Briefcase Icon"
                />
              </div>
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
            {/* Barra de progreso */}
            <div className="stepper">
              <div
                className="stepper-progress"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <div className="step-card">
                <h3>Información del negocio</h3>

                <div className="form-group">
                  <label>Nombre del Negocio</label>
                  <input
                    ref={inputRefs.businessName}
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  {errors.businessName && (
                    <span className="error-text">{errors.businessName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Teléfono (WhatsApp)</label>
                  <input
                    ref={inputRefs.phone}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>
              </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <div className="step-card">
                <h3>Datos de acceso</h3>

                <div className="form-group">
                  <label>Correo electrónico</label>
                  <input
                    ref={inputRefs.email}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    ref={inputRefs.password}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirmar contraseña</label>
                  <input
                    ref={inputRefs.confirmPassword}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
              <div className="step-card">
                <h3>Configuración del menú</h3>

                <div className="form-group">
                  <label>¿Cómo quieres crear tu menú?</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  >
                    <option value="INTERNAL">Crear mi menú aquí</option>
                    <option value="LOYVERSE">Vincular con Loyverse</option>
                  </select>
                </div>

                {formData.source === "LOYVERSE" && (
                  <div className="form-group">
                    <label>Loyverse API Key</label>
                    <input
                      ref={inputRefs.loyverseKey}
                      type="text"
                      name="loyverseKey"
                      value={formData.loyverseKey}
                      onChange={handleChange}
                    />
                    {errors.loyverseKey && (
                      <span className="error-text">{errors.loyverseKey}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 4 ================= */}
            {step === 4 && (
              <div className="step-card">
                <h3>Personaliza tu menú</h3>

                <div className="form-group">
                  <label>Tipo de Template</label>
                  <select
                    ref={inputRefs.templateType}
                    name="templateType"
                    value={formData.templateType}
                    onChange={handleChange}
                  >
                    <option value="TEMPLATE_1">Template 1 - Acordeón</option>
                    <option value="TEMPLATE_2">Template 2 - Grid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color Principal</label>
                  <input
                    ref={inputRefs.primaryColor}
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* ================= BOTONES ================= */}

            <div className="step-buttons">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Atrás
                </button>
              )}

              {step < totalSteps && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Siguiente
                </button>
              )}

              {step === totalSteps && (
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </button>
              )}
            </div>
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
