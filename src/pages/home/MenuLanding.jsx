import { useState, useEffect, useRef } from "react";
import "./MenuLanding.css";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

function Noise() {
  return (
    <div
      aria-hidden
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 50,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px",
      }}
    />
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`ml-navbar-wrap ${scrolled ? "ml-navbar-scrolled" : ""}`}
    >
      <div className="ml-navbar">
        <div className="ml-logo">
          <div className="ml-logo-icon">M</div>
          <span className="ml-logo-text">MenuLink</span>
        </div>
        <nav className="ml-nav-links">
          <a href="#como-funciona" className="ml-nav-link">
            Cómo funciona
          </a>
        </nav>
        <a href="/register" className="ml-btn-primary">
          Empieza gratis
        </a>
      </div>
    </motion.header>
  );
}

function Hero() {
  return (
    <section id="hero" className="ml-hero">
      <div className="ml-blob ml-blob-1" />
      <div className="ml-blob ml-blob-2" />
      <div className="ml-container ml-hero-grid">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="ml-badge"
          >
            <span className="ml-badge-dot" />
            Pedidos por WhatsApp, sin el caos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ml-hero-title"
          >
            Deja de perder <span className="ml-green">pedidos</span> por
            mensajes incomprensibles.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="ml-hero-sub"
          >
            Crea tu menú digital en minutos. Tus clientes eligen, arman su
            carrito y te llega{" "}
            <strong className="ml-strong">
              un solo mensaje claro y completo
            </strong>{" "}
            directo a WhatsApp. Sin confusiones. Sin errores. Sin ir y volver.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="ml-hero-ctas"
          >
            <div className="ml-cta-group">
              <a href="/register" className="ml-btn-primary ml-btn-lg">
                Crea tu menú gratis →
              </a>
              <span className="ml-microcopy">
                Sin tarjeta · Listo en 5 minutos
              </span>
            </div>
            <div className="ml-cta-group">
              <a href="/menu/pueba" className="ml-btn-outline ml-btn-lg">
                Ver cómo funciona
              </a>
              <span className="ml-microcopy">Demo interactiva en 2 min</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="ml-social-proof"
          >
            <div className="ml-avatars">
              {["🧑🏽‍🍳", "👩🏻‍🍳", "🧑🏾‍🍳", "👨🏼‍🍳"].map((e, i) => (
                <div key={i} className="ml-avatar">
                  {e}
                </div>
              ))}
            </div>
            <p className="ml-social-text">
              <strong>Integra tu negocio</strong> y reciben pedidos sin caos
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative" }}
        >
          <div className="ml-wa-mock">
            <div className="ml-wa-header">
              <div className="ml-wa-ava">🍔</div>
              <div>
                <p className="ml-wa-name">Burger House 🏠</p>
                <p className="ml-wa-online">en línea</p>
              </div>
            </div>
            <div className="ml-wa-msg">
              <p className="ml-wa-msg-label">Nuevo pedido 🎉</p>
              <div className="ml-wa-msg-body">
                <p>🍔 Smash Burger x2 — $180</p>
                <p>🍟 Papas XL x1 — $65</p>
                <p>🥤 Refresco x2 — $60</p>
                <div className="ml-wa-divider">
                  <p>
                    <strong>Total: $305 💰</strong>
                  </p>
                  <p>📦 Entrega a domicilio</p>
                  <p>💳 Pago: Transferencia</p>
                  <p>📍 Av. Insurgentes 450</p>
                  <p className="ml-wa-note">📝 Sin cebolla por favor</p>
                </div>
              </div>
            </div>
            <div className="ml-wa-reply-wrap">
              <div className="ml-wa-reply">¡Pedido recibido! 🙌 En 30 min.</div>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="ml-float-top"
          >
            ✓ Pedido claro y completo
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="ml-float-bottom"
          >
            ⚡ Llega en segundos
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const problems = [
  {
    icon: "😩",
    title: '"Un momento, ¿qué quisiste pedir?"',
    desc: "Tu cliente te manda 6 mensajes seguidos con el pedido partido en pedazos. Tú tratando de armar el rompecabezas.",
  },
  {
    icon: "❌",
    title: "Pedidos que llegan incompletos",
    desc: "Sin dirección. Sin método de pago. Sin cantidad exacta. Cada pedido, una adivinanza.",
  },
  {
    icon: "⏰",
    title: "Tiempo perdido que no recuperas",
    desc: "30 minutos al día preguntando lo mismo una y otra vez. Un mes entero perdido al año solo en aclaraciones.",
  },
  {
    icon: "💸",
    title: "Clientes que se van sin pedir",
    desc: "Si pedir es complicado, no piden. Así de simple. Cada pedido difícil es dinero que se va a la competencia.",
  },
];

function Problem() {
  return (
    <section className="ml-dark">
      <div className="ml-glow ml-glow-tr" />
      <div className="ml-container ml-rel">
        <Reveal className="ml-section-head">
          <p className="ml-label ml-label-green">El problema real</p>
          <h2 className="ml-title ml-title-white">
            Así se ve recibir pedidos por WhatsApp <br />
            <span className="ml-green">sin un sistema</span>
          </h2>
          <p className="ml-subtitle ml-subtitle-gray">
            Esto le pasa a cientos de restaurantes, dark kitchens y negocios
            locales todos los días.
          </p>
        </Reveal>
        <div className="ml-grid-2">
          {problems.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="ml-problem-card">
                <div className="ml-card-icon">{p.icon}</div>
                <h3 className="ml-card-title">{p.title}</h3>
                <p className="ml-card-desc">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.5} className="ml-callout-wrap">
          <div className="ml-callout">
            <p className="ml-callout-text">
              ¿Y si cada pedido llegara solo con toda la información lista para
              procesar?
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Solution() {
  const steps = [
    {
      step: "1",
      emoji: "👆",
      title: "Tu cliente entra a tu menú",
      desc: "Desde el link que compartiste o escaneando tu QR. Ve tus productos, precios y fotos.",
    },
    {
      step: "2",
      emoji: "🛒",
      title: "Arma su carrito",
      desc: "Elige cantidades, tipo de pedido (domicilio, recoger, comer aquí), método de pago y deja sus notas.",
    },
    {
      step: "3",
      emoji: "📲",
      title: "Te llega un mensaje perfecto",
      desc: "Un solo mensaje con todo: productos, cantidades, total, dirección y método de pago. Listo para procesar.",
    },
  ];
  return (
    <section className="ml-light">
      <div className="ml-container">
        <Reveal className="ml-section-head">
          <p className="ml-label ml-label-dark-green">La solución</p>
          <h2 className="ml-title ml-title-dark">
            Un menú digital que convierte el caos <br />
            <span className="ml-green">en pedidos perfectos</span>
          </h2>
          <p className="ml-subtitle ml-subtitle-gray">
            No necesitas apps, ni integraciones, ni saber de tecnología. Solo
            crear tu menú y compartirlo.
          </p>
        </Reveal>
        <div className="ml-grid-3">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="ml-step-card">
                <div className="ml-step-emoji">{s.emoji}</div>
                <p className="ml-step-num">Paso {s.step}</p>
                <h3 className="ml-step-title">{s.title}</h3>
                <p className="ml-step-desc">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const benefits = [
  {
    icon: "✅",
    title: "Pedidos claros desde el primer intento",
    desc: 'Nada de preguntar "¿para cuántos?" ni "¿cómo pagas?". El cliente completa todo antes de enviarte el pedido.',
  },
  {
    icon: "⚡",
    title: "Procesas el doble en el mismo tiempo",
    desc: "Sin ir y volver con mensajes. El pedido llega listo. Tú cocinas, no descifras.",
  },
  {
    icon: "🎯",
    title: "Menos errores, menos devoluciones",
    desc: "Cuando el cliente elige del menú, no puede equivocarse. Fin de los malentendidos por precios o productos.",
  },
  {
    icon: "💼",
    title: "Ves profesionalidad sin invertir en apps",
    desc: "Tu menú se ve limpio, moderno y de marca. Sin pagar comisiones ni armar integraciones.",
  },
  {
    icon: "📈",
    title: "Más pedidos, menos abandono",
    desc: "Pedir fácil = piden más. Un proceso fluido reduce la fricción y convierte más visitas en ventas reales.",
  },
  {
    icon: "🕐",
    title: "Recuperas tiempo que estabas perdiendo",
    desc: "Ese tiempo que gastas aclarando pedidos lo puedes dedicar a lo que importa: atender bien y crecer.",
  },
];

function Benefits() {
  return (
    <section className="ml-white">
      <div className="ml-container">
        <Reveal className="ml-section-head">
          <p className="ml-label ml-label-dark-green">Beneficios reales</p>
          <h2 className="ml-title ml-title-dark">
            Lo que cambia cuando tus pedidos <br />
            <span className="ml-green">llegan completos</span>
          </h2>
        </Reveal>
        <div className="ml-grid-3">
          {benefits.map((b, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="ml-benefit-card">
                <div className="ml-card-icon">{b.icon}</div>
                <h3 className="ml-benefit-title">{b.title}</h3>
                <p className="ml-benefit-desc">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Creas tu menú",
      desc: "Subes tus productos con nombre, precio, foto y descripción. Lo tienes listo en minutos. Puedes editarlo cuando quieras.",
      tag: "~5 minutos",
    },
    {
      num: "02",
      title: "Compartes tu link o QR",
      desc: "Pegas el link en tu Instagram, WhatsApp, historias o imprimes el QR para tu local. Listo. Tus clientes ya pueden pedir.",
      tag: "1 click para compartir",
    },
    {
      num: "03",
      title: "Recibes pedidos en WhatsApp",
      desc: "Cuando tu cliente confirma el pedido, te llega un mensaje estructurado con absolutamente todo. Sin preguntar nada más.",
      tag: "Automático 24/7",
    },
  ];
  return (
    <section id="como-funciona" className="ml-dark">
      <div className="ml-glow ml-glow-bl" />
      <div className="ml-container ml-rel">
        <Reveal className="ml-section-head">
          <p className="ml-label ml-label-green">Cómo funciona</p>
          <h2 className="ml-title ml-title-white">
            De cero a recibir pedidos perfectos
            <br />
            <span className="ml-green">en 3 pasos</span>
          </h2>
        </Reveal>
        <div className="ml-grid-3">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="ml-how-card">
                <div className="ml-how-num">{s.num}</div>
                <h3 className="ml-how-title">{s.title}</h3>
                <p className="ml-how-desc">{s.desc}</p>
                <span className="ml-how-tag">✓ {s.tag}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentiation() {
  const items = [
    {
      icon: "📵",
      label: "Sin descargar apps",
      desc: "Ni tú ni tu cliente necesitan instalar nada.",
    },
    {
      icon: "🚫",
      label: "Sin comisiones por pedido",
      desc: "Lo que vendes es tuyo.",
    },
    {
      icon: "🔌",
      label: "Sin integraciones complicadas",
      desc: "No necesitas POS, ni API, ni desarrollador.",
    },
    {
      icon: "🎓",
      label: "Sin saber de tecnología",
      desc: "Si usás WhatsApp, puedes usar MenuLink.",
    },
    {
      icon: "💳",
      label: "Sin contrato largo",
      desc: "Si no te sirve, lo dejas sin dramas.",
    },
    {
      icon: "🇲🇽",
      label: "Hecho para Mexico",
      desc: "En español, para nuestra forma de hacer negocios.",
    },
  ];
  return (
    <section className="ml-green-tint">
      <div className="ml-container">
        <Reveal className="ml-section-head">
          <p className="ml-label ml-label-dark-green">Por qué nosotros</p>
          <h2 className="ml-title ml-title-dark">
            Simple por diseño.
            <br />
            <span className="ml-dark-green">Sin complicaciones.</span>
          </h2>
          <p className="ml-subtitle ml-subtitle-gray">
            Otras soluciones te cobran comisión, te piden integraciones o son
            tan complicadas que necesitas un técnico. Nosotros no.
          </p>
        </Reveal>
        <div className="ml-grid-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="ml-diff-card">
                <div className="ml-card-icon">{item.icon}</div>
                <p className="ml-diff-label">{item.label}</p>
                <p className="ml-diff-desc">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Karla Méndez",
    role: "Dark Kitchen · CDMX",
    avatar: "👩🏻",
    quote:
      "Antes perdía 40 minutos al día aclarando pedidos. Ahora el pedido me llega completo y me pongo a cocinar. Es así de simple.",
  },
  {
    name: "Luis Armenta",
    role: "Taquería · Guadalajara",
    avatar: "👨🏽",
    quote:
      "Mis clientes me decían que era difícil pedirme por WhatsApp. Desde que tengo el menú, los pedidos aumentaron. No lo puedo creer.",
  },
  {
    name: "Sandra Ríos",
    role: "Postres · Bogotá",
    avatar: "👩🏾",
    quote:
      "Lo que más me gustó es que no tuve que aprender nada raro. En 10 minutos tenía mi catálogo y empecé a compartirlo.",
  },
];

function Testimonials() {
  return (
    <section className="ml-white">
      <div className="ml-container">
        <Reveal className="ml-section-head">
          <h2 className="ml-title ml-title-dark">
            Lo que dicen quienes ya lo usan
          </h2>
        </Reveal>
        <div className="ml-grid-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="ml-testi-card">
                <p className="ml-testi-quote">"{t.quote}"</p>
                <div className="ml-testi-author">
                  <div className="ml-testi-ava">{t.avatar}</div>
                  <div>
                    <p className="ml-testi-name">{t.name}</p>
                    <p className="ml-testi-role">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="ml-cta-sec">
      <div className="ml-cta-blob ml-cta-b1" />
      <div className="ml-cta-blob ml-cta-b2" />
      <div className="ml-cta-inner">
        <Reveal>
          <div className="ml-cta-emoji">📲</div>
          <h2 className="ml-cta-title">
            Hoy mismo puedes recibir tu primer pedido perfecto
          </h2>
          <p className="ml-cta-sub">
            Crea tu menú gratis ahora. En 5 minutos lo tienes listo para
            compartir. No necesitas tarjeta, no necesitas técnico, no necesitas
            excusa.
          </p>
          <div className="ml-cta-actions">
            <a href="/register" className="ml-btn-white">
              Crea tu menú gratis ahora →
            </a>
            <span className="ml-cta-micro">
              Sin tarjeta · Sin contratos · Configúralo en 5 minutos
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ml-footer">
      <div className="ml-footer-inner">
        <div className="ml-logo">
          <div className="ml-logo-icon ml-logo-sm">M</div>
          <span className="ml-footer-brand">MenuLink</span>
        </div>
        <p className="ml-footer-copy">
          © 2026 MenuLink · Hecho por InnBeta para negocios locales
        </p>
        <div className="ml-footer-links">
          <a href="#" className="ml-footer-link">
            Privacidad
          </a>
          <a href="#" className="ml-footer-link">
            Términos
          </a>
          <a href="#" className="ml-footer-link">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function MenuLanding() {
  return (
    <div className="ml-root">
      <Noise />
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Benefits />
      <HowItWorks />
      <Differentiation />
      <FinalCTA />
      <Footer />
    </div>
  );
}
