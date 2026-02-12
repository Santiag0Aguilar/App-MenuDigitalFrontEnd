import { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../utils/helpers";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get("cart");

    if (Array.isArray(savedCart)) {
      setItems(savedCart);
    } else {
      console.warn("Cart corrupto, reseteando...");
      setItems([]);
      storage.remove("cart");
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    storage.set("cart", items);
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prevItems, { ...product, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    storage.remove("cart");
  };

  const getItemCount = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotal = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const openCart = () => {
    setIsOpen(true);
  };

  const value = {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    toggleCart,
    closeCart,
    openCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
