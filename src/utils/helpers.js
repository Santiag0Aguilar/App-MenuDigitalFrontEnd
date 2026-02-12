// Generate business slug from business name
export const generateSlug = (businessName) => {
  if (!businessName) return "";

  return businessName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
};

// Build menu URL for a business
export const buildMenuUrl = (businessSlug) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/menu/${businessSlug}`;
};

// Format price for display
export const formatPrice = (price) => {
  if (price === null || price === undefined) return null;

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Colombian format)
export const isValidPhone = (phone) => {
  // Formato internacional tipo E.164: +5215512345678
  const regex = /^\+[1-9]\d{7,14}$/;
  return regex.test(phone);
};

// Apply primary color to CSS variables
export const applyPrimaryColor = (color) => {
  if (!color) return;

  document.documentElement.style.setProperty("--primary-color", color);

  // Generate lighter and darker variants
  const lighten = (col, percent) => {
    const num = parseInt(col.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const darken = (col, percent) => {
    const num = parseInt(col.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R > 1 ? R : 0) * 0x10000 +
        (G > 1 ? G : 0) * 0x100 +
        (B > 1 ? B : 0)
      )
        .toString(16)
        .slice(1)
    );
  };

  document.documentElement.style.setProperty(
    "--primary-light",
    lighten(color, 20),
  );
  document.documentElement.style.setProperty(
    "--primary-dark",
    darken(color, 20),
  );
};

// Get geolocation
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
};

// Generate WhatsApp message for order
export const generateWhatsAppMessage = (order) => {
  const {
    items,
    deliveryType,
    customerName,
    address,
    references,
    receiverName,
    location,
    arrivalTime,
    paymentMethod,
    hasChange,
    cashAmount,
    notes,
    tip,
  } = order;

  let message = `*Nuevo Pedido - InnBeta*\n\n`;
  message += `*Cliente:* ${customerName}\n`;

  const typeMap = {
    delivery: "Domicilio",
    pickup: "Recoger en local",
    dinein: "Comer en el lugar",
  };

  message += `*Tipo de pedido:* ${typeMap[deliveryType]}\n\n`;

  if (deliveryType === "delivery") {
    message += `*Quién recibe:* ${receiverName}\n`;
    message += `*Dirección:* ${address}\n`;
    if (references) message += `*Referencias:* ${references}\n`;

    if (location) {
      message += `*Ubicación:* https://maps.google.com/?q=${location.latitude},${location.longitude}\n`;
    }
    message += `\n`;
  } else {
    message += `*Hora de llegada:* ${arrivalTime}\n\n`;
  }

  message += `*Productos:*\n`;
  items.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  message += `\n*Total:* ${formatPrice(total)}\n`;

  if (tip) {
    message += `*Propina:* ${formatPrice(tip)}\n`;
  }

  message += `\n*Pago:* ${paymentMethod}\n`;

  if (paymentMethod === "cash") {
    if (hasChange) {
      message += `Pago exacto\n`;
    } else {
      const change = cashAmount - total;
      message += `Paga con: ${formatPrice(cashAmount)}\n`;
      message += `Cambio(Sin contar propia): ${formatPrice(change)}\n`;
    }
  }

  if (notes) {
    message += `\n*Notas:* ${notes}\n`;
  }

  return encodeURIComponent(message);
};

// Send order via WhatsApp
export const sendWhatsAppOrder = (phoneNumber, order) => {
  const message = generateWhatsAppMessage(order);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      // Intentamos parsear
      return JSON.parse(value);
    } catch {
      // Si falla el parse, devolvemos el string puro (ej: JWT)
      return localStorage.getItem(key);
    }
  },

  set: (key, value) => {
    try {
      if (typeof value === "string") {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch {
      return false;
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },
};

/* export const storage = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: (key) => localStorage.removeItem(key),
};
 */
/* export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};
 */
/* API errors helper */
export const parseApiError = (error) => {
  const data = error.response?.data;

  if (Array.isArray(data?.errors)) {
    return data.errors.map((e) => `• ${e.msg}`).join("\n");
  }

  return `• ${
    data?.error || data?.message || error.message || "Error desconocido"
  }`;
};
