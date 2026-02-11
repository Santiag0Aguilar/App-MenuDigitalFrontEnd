# Guía de Implementación - InnBeta Frontend

## 📌 Notas Importantes del Backend

### Endpoint Faltante
El backend actual no tiene un endpoint público para obtener el menú por slug. Necesitarás implementar:

```javascript
// Backend necesario
GET /menu/public/:businessSlug
// Retorna: { business, categories, products }
```

Mientras tanto, el frontend usa el endpoint autenticado `/menu/` para demo.

### Estructura de Datos Esperada

```javascript
// Response de GET /menu/
{
  business: {
    id: string,
    email: string,
    phone: string,
    businessName: string,
    templateType: 'TEMPLATE_1' | 'TEMPLATE_2',
    primaryColor: string,
    role: string,
    createdAt: string
  },
  categories: [
    {
      id: string,
      externalId: string,
      name: string,
      color: string,
      isActive: boolean,
      products: [
        {
          id: string,
          externalId: string,
          name: string,
          description: string,
          imageUrl: string,
          handle: string,
          price: number | null,
          isActive: boolean
        }
      ]
    }
  ]
}
```

## 🔧 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar Desarrollo
```bash
npm run dev
```

### 3. Primera Ejecución
1. Registrar un negocio en `/register`
2. Automáticamente se redirige al dashboard
3. Configurar color y template en `/dashboard/configuracion-ui`
4. Ver y descargar QR en `/dashboard/qr`
5. Visitar el menú público en la URL generada

## 🎨 Personalización del Diseño

### Colores
Los colores se manejan con CSS variables:
```css
:root {
  --primary-color: #3b82f6;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;
}
```

Se actualizan dinámicamente con `applyPrimaryColor()` en `utils/helpers.js`.

### Templates
Actualmente hay 2 templates:
- **TEMPLATE_1**: Diseño clásico con cards
- **TEMPLATE_2**: Diseño moderno con listas

Para agregar más templates, actualiza:
1. `components/ui/UICustomization.jsx` - Agregar en el array `templates`
2. Crear estilos específicos según el template activo

## 🛒 Flujo del Carrito

1. Usuario agrega producto → Se guarda en `CartContext` y `localStorage`
2. Hace clic en "Carrito" → Se abre `CartDrawer`
3. Modifica cantidades o elimina items
4. Click "Continuar al Pago" → Redirige a `/menu/:slug/checkout`
5. Completa formulario → Se genera mensaje de WhatsApp
6. Click "Enviar" → Abre WhatsApp con el pedido
7. Carrito se limpia → Redirige al menú con mensaje de éxito

## 📱 Integración WhatsApp

El mensaje generado incluye:
- Nombre del cliente
- Tipo de entrega (pickup/delivery)
- Dirección (si es domicilio)
- Lista de productos con cantidades
- Total
- Método de pago
- Si trae cambio (si es efectivo)

Formato:
```
*Nuevo Pedido - InnBeta*

*Cliente:* Juan Pérez
*Tipo:* Domicilio

*Dirección:* Calle 123 #45-67

*Productos:*
• 2x Hamburguesa Clásica - $30,000
• 1x Papas Fritas - $8,000

*Total:* $38,000

*Método de pago:* Efectivo
Cliente trae cambio
```

## 🔐 Seguridad

### JWT
- Se almacena en `localStorage` con key `accessToken`
- Se agrega automáticamente en headers vía interceptor de axios
- Duración: 24 horas
- Si expira o es inválido → Auto-logout y redirect a `/login`

### Validaciones Frontend
- Email: Formato válido
- Phone: 10 dígitos numéricos
- Passwords: Mínimo 6 caracteres
- Checkout: Campos requeridos según tipo de entrega

## 📊 Estados Globales

### AuthContext
```javascript
{
  user: Object | null,
  token: string | null,
  loading: boolean,
  login: (credentials) => Promise,
  register: (data) => Promise,
  logout: () => void,
  updateUser: (userData) => void,
  isAuthenticated: boolean
}
```

### UIContext
```javascript
{
  primaryColor: string,
  templateType: string,
  businessSlug: string,
  menuUrl: string,
  updatePrimaryColor: (color) => void,
  updateTemplateType: (template) => void
}
```

### CartContext
```javascript
{
  items: Array,
  isOpen: boolean,
  addItem: (product, quantity) => void,
  removeItem: (productId) => void,
  updateQuantity: (productId, quantity) => void,
  clearCart: () => void,
  getTotal: () => number,
  getItemCount: () => number,
  toggleCart: () => void,
  closeCart: () => void,
  openCart: () => void
}
```

## 🚨 Manejo de Errores

### API Errors
Los errores de API se manejan en el interceptor de axios:
- 401 → Auto-logout
- Otros → Se retornan al componente

### User Feedback
- Mensajes de error en rojo
- Mensajes de éxito en verde
- Loading states con spinner
- Validaciones inline en formularios

## 📦 Build para Producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para deploy.

### Optimizaciones
- Minificación de JS y CSS
- Code splitting automático
- Tree shaking
- Lazy loading de componentes (si se implementa)

## 🌐 Deploy

### Vercel (Recomendado)
1. Push a GitHub
2. Conectar repositorio en Vercel
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy automático en cada push

### Netlify
1. Build Command: `npm run build`
2. Publish Directory: `dist`
3. Redirects: `_redirects` file con `/* /index.html 200`

## 🐛 Troubleshooting

### El carrito no persiste
- Verificar que localStorage esté habilitado
- Limpiar caché del navegador

### Error 401 en todas las llamadas
- Verificar que el token esté en localStorage
- Verificar fecha de expiración del token
- Hacer logout y login nuevamente

### Productos no se muestran en menú público
- Verificar que `product.isActive === true`
- Verificar que `product.price !== null`
- Revisar filtros de categoría

### QR no se descarga
- Verificar permisos del navegador
- Intentar con otro navegador
- Usar opción "Imprimir" como alternativa

## 📞 Soporte

Para problemas con el backend, contactar al equipo de backend.
Para issues del frontend, revisar console del navegador primero.

---

**Versión:** 1.0.0  
**Última actualización:** 2024
