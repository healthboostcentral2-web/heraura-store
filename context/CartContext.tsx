import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { db } from '../lib/db';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = db.getCart();
      setCart(savedCart);
    } catch (e) {
      console.error("Failed to load cart from DB", e);
      setCart([]);
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    db.saveCart(newCart);
  };

  const addToCart = (newItem: CartItem) => {
    const existingItemIndex = cart.findIndex(
      item =>
        item.id === newItem.id &&
        item.selectedSize === newItem.selectedSize &&
        item.selectedColor.name === newItem.selectedColor.name
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + newItem.quantity
      };
    } else {
      updatedCart = [...cart, newItem];
    }
    saveCart(updatedCart);
  };

  const removeFromCart = (id: string) => {
     const updatedCart = cart.filter(item => item.id !== id);
     saveCart(updatedCart);
  };

  const updateQuantity = (id: string, delta: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const clearCart = () => {
      saveCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};