import React, { createContext, useContext, useState, useMemo } from 'react';
import { MenuItem } from '../types/types';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  total: number;
  date: string;
  restaurantName: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: () => Order | null;
  orders: Order[];
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-9821',
      restaurantName: "Swapnil's Signature Cafe",
      date: 'May 20, 2026',
      subtotal: 10.98,
      taxes: 1.98,
      deliveryFee: 1.99,
      total: 14.95,
      items: [
        { id: 'c1', name: 'Classic Cappuccino', price: 4.99, description: 'Rich espresso', quantity: 1, restaurantId: '1', restaurantName: "Swapnil's Signature Cafe" },
        { id: 'c2', name: 'Iced Caramel Macchiato', price: 5.99, description: 'Chilled espresso', quantity: 1, restaurantId: '1', restaurantName: "Swapnil's Signature Cafe" },
      ]
    },
    {
      id: 'ORD-4421',
      restaurantName: 'The Cake Studio',
      date: 'May 18, 2026',
      subtotal: 18.99,
      taxes: 3.42,
      deliveryFee: 2.99,
      total: 25.40,
      items: [
        { id: 'b1', name: 'Dark Chocolate Truffle', price: 18.99, description: 'Half kg premium cake', quantity: 1, restaurantId: '2', restaurantName: 'The Cake Studio' },
      ]
    }
  ]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return parseFloat(cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2));
  }, [cartItems]);

  const addToCart = (item: MenuItem, restaurantId: string, restaurantName: string) => {
    setCart((prev) => {
      const existing = prev[item.id];
      if (existing) {
        return {
          ...prev,
          [item.id]: { ...existing, quantity: existing.quantity + 1 },
        };
      }
      return {
        ...prev,
        [item.id]: {
          ...item,
          quantity: 1,
          restaurantId,
          restaurantName,
        },
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      
      const updated = { ...prev };
      if (existing.quantity > 1) {
        updated[itemId] = { ...existing, quantity: existing.quantity - 1 };
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const placeOrder = (): Order | null => {
    if (cartItems.length === 0) return null;

    const subtotal = cartSubtotal;
    const taxes = parseFloat((subtotal * 0.18).toFixed(2));
    const deliveryFee = 2.00; 
    const total = parseFloat((subtotal + taxes + deliveryFee).toFixed(2));
    const restaurantName = cartItems[0].restaurantName;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cartItems],
      subtotal,
      taxes,
      deliveryFee,
      total,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      restaurantName,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        orders,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};