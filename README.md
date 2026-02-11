# InnBeta Frontend

Frontend para InnBeta - Plataforma SaaS Multi-tenant de Menús Digitales para negocios con Loyverse.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Dashboard privado para negocios
- ✅ Menú público personalizable
- ✅ Carrito de compras funcional
- ✅ Checkout con WhatsApp
- ✅ Código QR descargable
- ✅ Personalización de colores y templates
- ✅ Sincronización con Loyverse
- ✅ Diseño responsive (mobile-first)

## 📋 Requisitos

- Node.js 16+
- npm o yarn

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🗂️ Estructura del Proyecto

```
src/
├── components/
│   ├── auth/              # Componentes de autenticación
│   ├── dashboard/         # Componentes del dashboard
│   ├── menu/             # Componentes del menú público
│   ├── common/           # Componentes reutilizables
│   └── ui/               # Componentes de UI
├── contexts/
│   ├── AuthContext.jsx   # Manejo de autenticación
│   ├── UIContext.jsx     # Personalización UI
│   └── CartContext.jsx   # Manejo del carrito
├── pages/
│   ├── auth/             # Páginas de login/register
│   ├── dashboard/        # Páginas del dashboard
│   └── menu/             # Páginas del menú público
├── services/
│   └── api.js            # Servicio de API
├── utils/
│   └── helpers.js        # Funciones auxiliares
├── hooks/                # Custom hooks
├── assets/               # Recursos estáticos
├── App.jsx               # Componente principal
├── main.jsx              # Punto de entrada
└── index.css             # Estilos globales
```

## 🌐 Rutas

### Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de negocio
- `/menu/:businessSlug` - Menú público
- `/menu/:businessSlug/checkout` - Checkout

### Privadas (requieren autenticación)
- `/dashboard` - Panel principal
- `/dashboard/productos` - Gestión de productos
- `/dashboard/categorias` - Gestión de categorías
- `/dashboard/configuracion-ui` - Personalización
- `/dashboard/qr` - Código QR

## 🔌 API

Base URL: `https://app-menudigital.onrender.com`

### Endpoints
- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `GET /usuarios/me` - Usuario actual
- `GET /menu/` - Obtener menú
- `POST /menu/update` - Actualizar configuración

## 🎨 Personalización

- **Colores**: Personalizable desde el dashboard
- **Templates**: 2 plantillas disponibles
- **QR**: Generado dinámicamente con el color principal

## 📱 Responsive

El diseño es completamente responsive con breakpoints en:
- Mobile: < 640px
- Tablet: 641px - 968px
- Desktop: > 968px

## 🔐 Autenticación

- JWT almacenado en localStorage
- Duración: 24 horas
- Renovación automática
- Rutas protegidas con HOC

## 🛒 Carrito

- Persistencia en localStorage
- Actualización en tiempo real
- Validaciones de stock
- Integración con WhatsApp

## 📲 WhatsApp Integration

El checkout genera un mensaje formateado que se envía automáticamente al WhatsApp del negocio.

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test
```

## 🚢 Despliegue

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

## 📝 Variables de Entorno

No se requieren variables de entorno. La API base está hardcodeada en `src/services/api.js`.

## 🤝 Contribución

Este es un proyecto privado para InnBeta.

## 📄 Licencia

Propietario - InnBeta © 2024
